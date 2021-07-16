import { useEffect, useState } from "react";

import Header from "./HeaderLayout";
import Footer from "./FooterLayout";
import ReactHtmlParser from "react-html-parser";
import {
  Container,
  MainInner,
  ImageContainer,
  ImageThumbnail,
  ArticleTitle,
} from "../styles/styles";

const RenderContent = ({ post }) => {
  return (
    <Container>
      <Header />
      {/* {clientData.map((post, i) => ( */}
      <MainInner>
        <ArticleTitle>{post.title}</ArticleTitle>
        {/* {post.image.length > 0 && ( */}
        <ImageContainer>
          <ImageThumbnail
            src={post.image}
            alt={clientData.title.rendered}
            layout="fill"
          />
        </ImageContainer>
        {/* )} */}
        {ReactHtmlParser(post.content)}
      </MainInner>
      {/* ))} */}
      ;
      <Footer />
    </Container>
  );
};

export default RenderContent;
