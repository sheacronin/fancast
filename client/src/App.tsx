import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Stack, Button } from 'react-bootstrap';
import { useAuth, useAuthDispatch } from './context';

const App = () => {
  const { user } = useAuth();
  const { logout } = useAuthDispatch();

  return (
    <div className="bg-light vw-100 min-vh-100">
      <Navbar bg="dark" className="mb-4 text-light" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
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
                <Nav.Item>Welcome, {user.username}</Nav.Item>
                <Nav.Item as={Button} onClick={logout}>
                  Logout
                </Nav.Item>
              </>
            )}
          </Stack>
        </Container>
      </Navbar>
      <Container as="main" className="pb-5">
        <Outlet />
      </Container>
    </div>
  );
};

export default App;
