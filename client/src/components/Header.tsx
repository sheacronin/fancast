import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Stack,
  Button,
  Image,
  Spinner,
} from 'react-bootstrap';
import { useAuth, useAuthDispatch } from '../context';
import fancastLogo from '../assets/fancast_logo.png';

export const Header = () => {
  const { user, loading } = useAuth();
  const { logout } = useAuthDispatch();

  return (
    <header>
      <Navbar bg="dark" className="mb-4 text-light" data-bs-theme="dark">
        <Container className="flex-wrap">
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex gap-2 align-items-center text-decoration-underline link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
          >
            <Image src={fancastLogo} alt="Fancast Logo" fluid width={40} />
            <h1 className="h3 m-0">Fancast</h1>
          </Navbar.Brand>
          <Stack direction="horizontal" gap={3}>
            {user === null ? (
              <>
                <Nav.Item as={Link} to="/login">
                  Login
                </Nav.Item>
                <Nav.Item as={Link} to="/register">
                  Register
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Item className="text-uppercase">
                  Welcome, {user.username}
                </Nav.Item>
                <Nav.Item as={Button} onClick={logout}>
                  {!loading ? (
                    'Logout'
                  ) : (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      variant="secondary"
                      className="mx-3"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Nav.Item>
              </>
            )}
          </Stack>
        </Container>
      </Navbar>
    </header>
  );
};
