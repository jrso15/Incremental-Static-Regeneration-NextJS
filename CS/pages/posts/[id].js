import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/HeaderLayout";
import Footer from "../../components/FooterLayout";
import ReactHtmlParser from "react-html-parser";
import RenderContent from "../../components/RenderContent";
import {
  Container,
  MainInner,
  ImageContainer,
  ImageThumbnail,
  ArticleTitle,
} from "../../styles/styles";

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;

  let data;
  try {
    const res = await fetch("http://34.87.84.83/wp-json/wp/v2/posts/" + id);
    data = await res.json();
  } catch (err) {
    console.log(`Unable to fetch post api: ${err}`);
    return {
      props: {
        post: {
          id: "",
          title: "",
          date: "",
          image: "",
          content: "",
        },
      },
    };
  }

  let image = "";
  let dateString = "";
  dateString = data.date;
  dateString = new Date(dateString).toGMTString();
  dateString = dateString.split(" ").slice(0, 4).join(" ");

  if (
    data["_links"]["wp:featuredmedia"] &&
    data["_links"]["wp:featuredmedia"].length > 0
  ) {
    try {
      const imageApi = data["_links"]["wp:featuredmedia"][0].href;
      const res = await fetch(imageApi);
      const imageData = await res.json();

      if (imageData.guid && imageData.guid.rendered) {
        image = imageData.guid.rendered;
      }
    } catch (err) {
      console.log(`Unable to fetch image api: ${err}`);
      image = "";
    }
  }

  return {
    props: {
      post: {
        id: id,
        title: data.title.rendered,
        date: dateString,
        image: image,
        content: data.content.rendered,
      },
    },
  };
};

const InnerArticle = ({ post }) => {
  const [clientData, setClientData] = useState([]);
  console.log(post);
  const { isFallback } = useRouter();

  useEffect(() => {
    if (isFallback && !clientData) {
      fetch("http://34.87.84.83/wp-json/wp/v2/posts/" + post.id).then(
        async (resp) => {
          setClientData(await resp.json());
        }
      );
    }
  }, [clientData, isFallback]);

  if (isFallback || !post) {
    return <RenderContent post={clientData} />;
  } else {
    return <RenderContent post={post} />;
  }
};

export default InnerArticle;
