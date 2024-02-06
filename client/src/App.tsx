import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';

const App = () => {
  return (
    <>
      <Navbar bg="dark" className="mb-4" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/">Fancast</Link>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container as="main" className="pb-5">
        <Outlet />
      </Container>
    </>
  );
};

export default App;
