import { Link } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import fancastLogo from '../assets/fancast_logo_primary.png';
import tmdbLogo from '../assets/tmdb_logo.svg';
import googleLogo from '../assets/google_logo.png';

export const Footer = () => {
  return (
    <footer className="mt-auto px-4 py-5 bg-secondary-subtle text-secondary-dark fw-light fs-7">
      <Container>
        <Row>
          <Col
            xs={{ span: 10, offset: 1 }}
            sm={{ span: 5, offset: 0 }}
            md={{ span: 4, offset: 0 }}
          >
            <h5 className="d-flex align-items-center">
              <Image
                src={fancastLogo}
                alt="Fancast Logo"
                fluid
                width={40}
                className="me-1"
              />
              Fancast
            </h5>
            <p>This web application was created by Shea Cronin.</p>
            <p className="mb-4">
              <Link to="https://github.com/sheacronin/fancast">
                GitHub Repository
              </Link>
            </p>
          </Col>
          <Col
            xs={{ span: 10, offset: 1 }}
            sm={{ span: 5, offset: 2 }}
            md={{ span: 4, offset: 4 }}
          >
            <h6>Attributions</h6>
            <p>
              <Image
                src={googleLogo}
                alt="Google Logo"
                fluid
                width={40}
                className="d-block mb-2"
              />
              This product uses the{' '}
              <Link to="https://developers.google.com/books" target="_blank">
                Google Books API
              </Link>{' '}
              but is not endorsed by or affiliated with Google.
            </p>
            <p className="mb-0">
              <Image
                src={tmdbLogo}
                alt="The Movie Database Logo"
                fluid
                width={40}
                className="d-block mb-2"
              />
              This product uses the{' '}
              <Link to="https://www.themoviedb.org" target="_blank">
                TMDB
              </Link>{' '}
              API but is not endorsed or certified by TMDB.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
