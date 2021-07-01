import Head from "next/head";
import Link from "next/link";
import HeaderContainer from "../components/Header";
import FooterContainer from "../components/Footer";
import ReactHtmlParser from "react-html-parser";
import {
  Container,
  Main,
  Article,
  ListTitle,
  ThumbnailContainer,
  ImageThumbnail,
  DateStyle,
} from "../styles/styles";

export const getStaticProps = async () => {
  const res = await fetch("http://34.126.160.141/wp-json/wp/v2/posts");
  let posts = await res.json();
  let image = "";
  let dateString = "";

  posts = await Promise.all(
    posts.map(async (post, i) => {
      dateString = post.date;
      dateString = new Date(dateString).toGMTString();
      dateString = dateString.split(" ").slice(0, 4).join(" ");

      if (
        post["_links"]["wp:featuredmedia"] &&
        post["_links"]["wp:featuredmedia"].length > 0
      ) {
        const imageApi = post["_links"]["wp:featuredmedia"][0].href;
        const res = await fetch(imageApi);
        const data = await res.json();
        image = data.guid.rendered;
      }
      return { ...post, image, dateString };
    })
  );

  return {
    props: { posts },
    revalidate: 10,
  };
};

const Home = ({ posts }) => {
  return (
    <Container>
      <Head>
        <title>ARTICLES</title>
        <meta name="description" content="articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderContainer />

      <Main>
        {posts.map((post) => (
          <Link href={"/posts/" + post.id} key={post.id}>
            <Article>
              <ListTitle>{post.title.rendered}</ListTitle>
              {post.image.length > 0 && (
                <ThumbnailContainer>
                  <ImageThumbnail
                    src={post.image}
                    alt={post.title.rendered}
                    layout="fill"
                  />
                </ThumbnailContainer>
              )}
              {ReactHtmlParser(post.excerpt.rendered)}
              <DateStyle>Published: {post.dateString}</DateStyle>
            </Article>
          </Link>
        ))}
      </Main>

      <FooterContainer />
    </Container>
  );
};

export default Home;
