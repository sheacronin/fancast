import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Header, Footer } from './components';

const App = () => {
  return (
    <div className="bg-light vw-100 min-vh-100 d-flex flex-column">
      <Header />
      <Container as="main" className="pb-5">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default App;
