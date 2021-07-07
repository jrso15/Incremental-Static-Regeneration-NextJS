import Header from "../../components/HeaderLayout";
import Footer from "../../components/FooterLayout";
import ReactHtmlParser from "react-html-parser";
import {
  Container,
  MainInner,
  ImageContainer,
  ImageThumbnail,
  ArticleTitle,
} from "../../styles/styles";

// export const getStaticPaths = async () => {
//   const res = await fetch("http://34.87.36.219/wp-json/wp/v2/posts");
//   const data = await res.json();

//   const paths = data.map((post) => {
//     return {
//       params: {
//         id: post.id.toString(),
//       },
//     };
//   });
//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await fetch("http://34.87.36.219/wp-json/wp/v2/posts/" + id);
  const data = await res.json();

  console.log(data);

  let image = "";
  let dateString = "";
  dateString = data.date;
  dateString = new Date(dateString).toGMTString();
  dateString = dateString.split(" ").slice(0, 4).join(" ");

  if (
    data["_links"]["wp:featuredmedia"] &&
    data["_links"]["wp:featuredmedia"].length > 0
  ) {
    const imageApi = data["_links"]["wp:featuredmedia"][0].href;
    const res = await fetch(imageApi);
    const imageData = await res.json();

    if (imageData.guid && imageData.guid.rendered) {
      image = imageData.guid.rendered;
    }
  }

  return {
    props: {
      post: {
        title: data.title.rendered,
        date: dateString,
        image: image,
        content: data.content.rendered,
      },
    },
  };
};

const InnerArticle = ({ post }) => {
  console.log(post);
  return (
    <Container>
      <Header />

      <MainInner>
        <ArticleTitle>{post.title}</ArticleTitle>
        {post.image.length > 0 && (
          <ImageContainer>
            <ImageThumbnail
              src={post.image}
              alt={post.title.rendered}
              layout="fill"
            />
          </ImageContainer>
        )}
        {ReactHtmlParser(post.content)}
      </MainInner>

      <Footer />
    </Container>
  );
};

export default InnerArticle;
