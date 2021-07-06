import Link from "next/link";
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
    fallback: "blocking",
  };
};

export const getStaticProps = async (context) => {
  const { page } = context.params;
  const res = await fetch(
    "http://34.87.36.219/wp-json/wp/v2/posts?page=" + page
  );
  const totalNumberOfItems = res.headers.get("x-wp-total");
  const totalNumberOfPages = Math.ceil(totalNumberOfItems / 10).toString();

  let nextPage =
    page !== totalNumberOfPages ? (parseInt(page) + 1).toString() : -1;
  let prevPage = page !== 1 ? page - 1 : -1;

  let posts = await res.json();
  let image = "";
  let dateString = "";

  console.log(res);

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

        if (data.guid && data.guid.rendered) {
          image = data.guid.rendered;
        }
      }
      return { ...post, image, dateString };
    })
  );

  return {
    props: { posts, nextPage, prevPage },
    revalidate: 10,
  };
};

const InnerPage = ({ posts, nextPage, prevPage }) => {
  console.log("test", posts);
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
};

export default InnerPage;
