import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Stack } from 'react-bootstrap';

const App = () => {
  return (
    <>
      <Navbar bg="dark" className="mb-4" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <h1 className="h3 m-0">Fancast</h1>
          </Navbar.Brand>
          <Stack direction="horizontal" gap={3}>
            <Nav.Item as={Link} to="/login">
              Login
            </Nav.Item>
            <Nav.Item as={Link} to="/register">
              Register
            </Nav.Item>
          </Stack>
        </Container>
      </Navbar>
      <Container as="main" className="pb-5">
        <Outlet />
      </Container>
    </>
  );
};

export default App;
