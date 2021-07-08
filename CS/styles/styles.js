import Image from "next/image";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Main = styled.main`
  width: 100%;
  padding: 5rem 3rem;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5rem 1rem;
  }
  @media (min-width: 1200px) {
    flex-direction: row;
    padding: 5rem 10rem;
  }
`;

export const MainInner = styled.main`
  width: 70%;
  padding: 5rem 0rem;
  margin: 0 auto;
  @media (min-width: 768px) {
    height: auto;
    min-height: 780px;
    padding: 5rem 3rem;
  }
  @media (min-width: 1200px) {
    height: auto;
    min-height: 600px;
  }
`;

export const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  text-transform: uppercase;
  color: #604020;
  font-weight: 900;
  margin-right: 30px;
`;

export const ArticleTitle = styled.h1`
  font-size: 3em;
  margin-bottom: 30px;
  color: #ebabab;
`;

export const ListTitle = styled.h2`
  color: #ebabab;
`;

export const HeaderContainer = styled.header`
  width: 100%;
`;

export const Nav = styled.nav`
  width: 100%;
  padding: 1rem 2rem;
  background-color: #ebabab;
  @media (min-width: 768px) {
    padding: 1rem 3rem;
  }
  @media (min-width: 1200px) {
    padding: 1rem 5rem;
  }
`;

export const Links = styled.a`
  font-size: 1.1em;
  margin: 0px 20px;
  font-weight: 700;
  color: #392613;
  &:hover {
    color: #604020;
  }
`;

export const Article = styled.div`
  width: 100%;
  height: auto;
  border: 1px solid #9c6e6e;
  margin-bottom: 50px;
  padding: 20px;
  cursor: pointer;
  @media (min-width: 768px) {
    width: 32%;
  }
`;

export const ThumbnailContainer = styled.div`
  width: 100%;
  position: relative;
  height: 250px;
  max-height: 250px;
  margin: 20px 0;
`;

export const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  margin: 40px 0;
  height: 200px;
  @media (min-width: 768px) {
    height: 300px;
    max-height: 550px;
  }
  @media (min-width: 1200px) {
    height: 550px;
    max-height: 550px;
  }
`;

export const ImageThumbnail = styled(Image)`
  width: 100%;
`;

export const DateStyle = styled.p`
  margin-top: 30px;
  font-size: 15px;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 25px;
  font-weight: bold;
  border-top: 1px solid #b3b3b3;
  padding-top: 5px;
  color: #ebabab;
`;

export const NextLink = styled.a`
  margin-left: auto;
`;

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 2rem 2rem;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  background-color: #9c6e6e;
  font-size: 1.3em;
  @media (min-width: 768px) {
    padding: 2rem 10rem;
  }
`;
