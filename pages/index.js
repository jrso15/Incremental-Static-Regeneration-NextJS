import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import Articles from "../components/articles";
import Footer from "../components/footer";
import { Container } from "../styles/styles";

const Home = () => {
  return (
    <Container>
      <Head>
        <title>ARTICLES</title>
        <meta name="description" content="articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Articles />

      <Footer />
    </Container>
  );
};

export default Home;
