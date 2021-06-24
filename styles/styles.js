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
    padding: 5rem 3rem;
  }
  @media (min-width: 1200px) {
    flex-direction: row;
    padding: 5rem 10rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.5em;
  text-align: left;
  color: #604020;
  font-weight: 900;
  margin-right: 30px;
`;

export const HeaderContainer = styled.header`
  width: 100%;
`;

export const Nav = styled.nav`
  width: 100%;
  padding: 1rem 2rem;
  background-color: #ebabab;
  display: flex;
  align-items: center;
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
  height: 500px;
  border: 1px solid red;
  margin-bottom: 30px;
  @media (min-width: 768px) {
    width: 32%;
  }
`;

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 4rem 5rem;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #9c6e6e;
`;
