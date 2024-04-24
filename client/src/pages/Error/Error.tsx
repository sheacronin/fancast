import { Container, Row, Col } from 'react-bootstrap';
import { Header, Footer } from '../../components';
import { Link } from 'react-router-dom';

export const Error = () => {
  return (
    <div className="bg-light vw-100 min-vh-100 d-flex flex-column">
      <Header />
      <Container as="main" className="py-5 text-center">
        <Row>
          <Col>
            <h2>There was an error.</h2>
            <p>
              <Link to="/">Return Home</Link>
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
