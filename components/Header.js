import { HeaderContainer, Nav, Links, Title } from "../styles/styles";
import Link from "next/link";

const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Link href="/">
          <a>
            <Title>PERSISTENT DISK</Title>
          </a>
        </Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
