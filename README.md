# lighthouse-poc

Followed most steps from this tutorial:
https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk
But the tutorial makes use of PVC, the goal for POC is to use a cloudstorage bucket.

## GCP Resources

Zonal Kubernetes cluster with 1 master and 2 control planes in asia-southeast1-a, provisioned via:

```
gcloud beta container --project "${PROJECT_ID}" clusters create "${CLUSTER_NAME}" --zone "${CLUSTER_ZONE}" --no-enable-basic-auth --cluster-version "1.19.9-gke.1900" --release-channel "regular" --machine-type "e2-medium" --image-type "COS_CONTAINERD" --disk-type "pd-standard" --disk-size "100" --metadata disable-legacy-endpoints=true --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" --num-nodes "3" --enable-stackdriver-kubernetes --enable-ip-alias --network "projects/lighthouse-sandbox/global/networks/default" --subnetwork "projects/lighthouse-sandbox/regions/asia-southeast1/subnetworks/default" --no-enable-intra-node-visibility --default-max-pods-per-node "110" --no-enable-master-authorized-networks --addons HorizontalPodAutoscaling,HttpLoadBalancing,GcePersistentDiskCsiDriver --enable-autoupgrade --enable-autorepair --max-surge-upgrade 1 --max-unavailable-upgrade 0 --enable-shielded-nodes --node-locations "${CLUSTER_ZONE}"
```

## Pre-requisites

Copy and update the environment variables:

```
$ cp .envrc.sample .envrc
```

Allow the `.envrc` variables, via direnv:

```
$ direnv allow
```

Authenticate gcloud to the cluster:

```
$ gcloud container clusters get-credentials $CLUSTER_NAME --zone=$CLUSTER_ZONE
```

## Postman Collections

Official docs: https://developer.wordpress.org/rest-api/reference

Anything that's available publicly will also be accessible via the API, so no authentication
required at this point.

Example requests are in [postman-collections](postman-collections). Request are as follows:

1. `List Posts` - retrieves all the posts
2. `Get Post` - retrieves a particular post by ID, then automatically sets the `{{media_url}}` for the `Get Media` request based on the featured media
3. `Get Media` - value automatically set when `Get Post` is ran, retrieves the featured media of a particular post

Import the `Lighthouse POC.postman_collection.json` and the two environments:

1. `Lighthouse POC - with cloud storage.postman_environment.json` - retrieves all media files from a cloud storage bucket
2. `Lighthouse POC - with persistent disk.postman_environment.json` - retrievse all media files from a persistent disk

## CloudSQL

We connect via a CloudSQL auth proxy using `localhost` via a sidecar pattern, increasing security and performance.
GKE is configured to provide the service account to the CloudSQL Auth proxy using
a service account key file.

1. Create a new instance

```
$ gcloud sql instances create --database-version=MYSQL_5_7 --cpu=2 --memory=4GB --region=asia-southeast1 $INSTANCE_NAME
```

2. Create a new database

```
$ gcloud sql databases create <DATABASE-NAME> --instance $CLOUDSQL_INSTANCE_NAME
```

3. Create a new user and password

```
$ gcloud sql users create <DATABASE-USER> --host=% --instance $CLOUDSQL_INSTANCE_NAME \
    --password $CLOUDSQL_PASSWORD
```

## Service Account CloudSQL Auth Proxy Keyfile

1. Allow the wordpress to connect to the running cloud SQL instance, grant the `cloudsql.client` role

```
$ gcloud iam service-accounts create $SA_NAME --display-name $SA_NAME
$ gcloud projects add-iam-policy-binding $PROJECT_ID \
    --role roles/cloudsql.client \
    --member serviceAccount:$CLOUDSQL_SA_EMAIL
```

2. Create the SA keys

```
$ gcloud iam service-accounts keys create $WORKING_DIR/key.json \
    --iam-account $CLOUDSQL_SA_EMAIL
```

### Deployments

Below are brief description of the namespaces, each has its own database and database
user, all under the same instance (see section on `CloudSQL`)

## `with-pvc`

`with-pvc` is a vanilla wordpress + cloudSQL instance, backed by a persistent disk for its media and assets

URL: http://34.126.160.141
Credentials: `test-poc-user/testpoc111@`

Create the secrets, then apply the manifests:

```
$ kubectl create ns with-pvc
$ ./secrets.sh with-pvc
$ kubectl apply -n with-pvc -f with-pvc/
```

Database name: `wordpress`

## `with-cs-bucket`

`with-cs-bucket` namespace is a vanilla wordpress + cloudSQL instance, backed by a cloud storage bucket for its media and assets

URL: http://34.87.84.83
Credentials: `test-poc-user/t#ZqQswYSrg2PUq&D%`

```
$ kubectl create ns with-cs-bucket
$ ./secrets.sh with-cs-bucket
$ kubectl apply -n with-cs-bucket -f with-pvc/
```

Database name: `wordpress-with-cs`
Cloud Storage Bucket: `lighthouse-poc`

### Monitoring

Kubernetes doesn't come with monitoring and alerting setup, usually it relies on opensource efforts to make it happen.
For this POC, we use `linkerd` as our service mesh and k6 to perform load tests.

The service mesh is used for monitoring service-to-service communication and will give us useful metrics like request
latency, request path, success & error rates and more. For when we have more than one service running in our cluster,
it will enable us to determine which of the services is causing the bottlenecks in case a high latency is observed.

#### `linkerd`

We were hit by this issue https://github.com/linkerd/linkerd2/issues/3962 and so the stable release
of linkerd won't work on us. We use the edge release for this POC, see https://linkerd.io/edge.

Setup linkerd (check https://linkerd.io/2.10/getting-started for more details on how to use the `linkerd` CLI):

```
$ curl -sL https://run.linkerd.io/install-edge | sh
$ linkerd version
$ linkerd check --pre
$ linkerd install | kubectl apply -f -
$ linkerd check
$ linkerd viz install | kubectl apply -f - # on-cluster metrics stack
```

To _mesh_ our service, it needs to be annotated manually, do so by:

```
$ kubectl get <deployment/statefulset> -n <namespace> -o yaml | linkerd inject - | kubectl apply -f -
```

This will add the `linkerd.io/inject: enabled` annotation to our workloads that we want linkerd to
monitor.

#### `k6`

See instructions on how to install https://k6.io/docs/getting-started/installation and the [benchmark](benchmark/)
directory for the artifacts, sample usage:

```
$ k6 run -vu 10 -i 3000 -d 60s benchmark/with-pd.js
```

This will simulate 10 virtual users hitting our endpoints for 60s.

#### Test Data

Generating test data:

1. Query 100 posts from the wordpress API (or via postman) and save the output to a file:

```
$ curl --location --request GET 'http://34.126.160.141/wp-json/wp/v2/posts?per_page=100' | jq > cat dest.txt
```

2. Get all the IDs and append a `","` so we can just copy-and-paste it to our [k6 scripts](benchmark/)

```
$ cat dest.txt | jq '.[] | .id' | awk '{print $1 ","}'
```

#### Enabling CloudStorage bucket

Installed the plugin:
https://wordpress.org/plugins/wp-stateless

Followed manual instruction on:
https://wp-stateless.github.io/docs/manual-setup

Additional guide:
https://geekflare.com/wordpress-media-google-cloud-storage

#### Deploy Next.js Static Website with GCP Cloud Storage ###

See instructions on how to deploy a static website on cloud storage.

1. Create a Bucket With Public Access
   * Create a bucket
   * Select a location where you store the data.
   * Select a default storage class for your data.
   * Select access control for your bucket. `Fine-grained` making all files in your bucket publicly accessible is easier and faster.
   * Select create to create the bucket.
2. Make it Public
   * Click the vertical ellipsis on the right side and click `Edit bucket permissions`.
   * Add a member called `allUsers` with the role Storage Object Viewer.
   * Click `Allow Public Access` to make it public.
3. Build the Next.js project
    * Build your app with this command `npm run build`
    * After that all the built assets can be found in the out folder.

```javascript
ok
         ```
