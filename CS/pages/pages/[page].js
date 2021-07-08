import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/HeaderLayout";
import Footer from "../../components/FooterLayout";
import ReactHtmlParser from "react-html-parser";
import {
  Container,
  Main,
  Article,
  ListTitle,
  ThumbnailContainer,
  ImageThumbnail,
  DateStyle,
  ButtonWrapper,
} from "../../styles/styles";

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const { page } = context.params;

  let res;
  try {
    res = await fetch("http://34.87.84.83/wp-json/wp/v2/posts?page=" + page);
  } catch (err) {
    console.log(`Unable to fetch page api: ${err}`);

    return {
      props: {},
      revalidate: 10,
    };
  }

  const totalNumberOfItems = res.headers.get("x-wp-total");
  const totalNumberOfPages = Math.ceil(totalNumberOfItems / 10).toString();

  let nextPage =
    page !== totalNumberOfPages ? (parseInt(page) + 1).toString() : -1;
  let prevPage = page !== 1 ? page - 1 : -1;

  let posts = [];
  posts = await res.json();
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
        try {
          const imageApi = post["_links"]["wp:featuredmedia"][0].href;
          const imageRes = await fetch(imageApi);
          const data = await imageRes.json();

          if (data.guid && data.guid.rendered) {
            image = data.guid.rendered;
          }
        } catch (err) {
          console.log(`Unable to fetch image api: ${err}`);
          image = "";
        }
      }
      return { ...post, image, dateString };
    })
  );

  return {
    props: { posts, nextPage, prevPage, page },
    revalidate: 10,
  };
};

const InnerPage = ({ posts, nextPage, prevPage, page }) => {
  console.log("test", posts);

  const [clientData, setClientData] = useState([]);
  const { isFallback } = useRouter();
  useEffect(() => {
    if (isFallback && !clientData) {
      fetch("http://34.87.84.83/wp-json/wp/v2/posts?page=" + page).then(
        async (resp) => {
          setClientData(await resp.json());
        }
      );
    }
  }, [clientData, isFallback]);

  if (isFallback || !posts) {
    return (
      <Container>
        <Header />
        <Main>
          {clientData.map((post) => (
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
          <ButtonWrapper>
            {prevPage && prevPage <= 1 && <Link href={"/"}>PREV</Link>}

            {prevPage && prevPage > 1 && (
              <Link href={"/pages/" + prevPage}>PREV</Link>
            )}

            {nextPage && nextPage > 1 && (
              <Link href={"/pages/" + nextPage}>NEXT</Link>
            )}
          </ButtonWrapper>
        </Main>

        <Footer />
      </Container>
    );
  } else {
    return (
      <Container>
        <Header />

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
          <ButtonWrapper>
            {prevPage && prevPage <= 1 && <Link href={"/"}>PREV</Link>}

            {prevPage && prevPage > 1 && (
              <Link href={"/pages/" + prevPage}>PREV</Link>
            )}

            {nextPage && nextPage > 1 && (
              <Link href={"/pages/" + nextPage}>NEXT</Link>
            )}
          </ButtonWrapper>
        </Main>

        <Footer />
      </Container>
    );
  }
};

export default InnerPage;
