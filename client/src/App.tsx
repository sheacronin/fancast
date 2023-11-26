import React, { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ListGroup,
  Image,
} from 'react-bootstrap';
import type { Book } from './types';

function App() {
  const [booksList, setBooksList] = useState<Book[]>([]);

  return (
    <Container fluid as="main" className="py-5">
      <h1 className="text-center">Fancast</h1>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSearchSubmit}>
            <Form.Group controlId="search">
              <Form.Label>Book search</Form.Label>
              <InputGroup>
                <Form.Control type="text" placeholder="Book title" />
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
          {booksList.length > 0 && (
            <ListGroup
              as="ul"
              variant="flush"
              className="border rounded-bottom"
            >
              {booksList.map((book) => (
                <ListGroup.Item as="li" className="d-flex" key={book.id}>
                  <Col xs={3} sm={2} md={1}>
                    <Image
                      src={book.imageLink}
                      alt={`${book.title} Cover`}
                      thumbnail
                      className="mw-100"
                    />
                  </Col>
                  <Col className="ms-3">
                    <h5>{book.title}</h5>
                    {book.authors && <h6>{book.authors[0]}</h6>}
                  </Col>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );

  async function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { search } = e.target as typeof e.target & {
      search: { value: string };
    };
    const response = await fetch(`books/search/${search.value}`);
    const data = await response.json();
    console.log(data);
    setBooksList(data);
  }
}

export default App;
