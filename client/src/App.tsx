import React from 'react';
import type { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

interface AppProps {
  children: ReactNode;
}

const App = ({ children }: AppProps) => {
  return (
    <Container fluid as="main" className="py-5">
      <h1 className="text-center">Fancast</h1>
      {children}
    </Container>
  );
};

export default App;
