import { useState } from 'react';
import type { FormEvent } from 'react';
import { Row, Col, ListGroup, Image, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { InputBar } from '../../components';
import type { Book } from '../../types';
import { API_BASE_URL } from '../../constants';
import defaultBookImage from '../../assets/default_book.jpg';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [booksList, setBooksList] = useState<Book[]>([]);

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <InputBar
          handleSubmit={handleBookSearch}
          controlId="search"
          label="Book search"
          placeholder="Book title"
        />
        {(booksList.length > 0 || loading) && (
          <ListGroup as="ul" variant="flush" className="border rounded-bottom">
            {loading ? (
              <ListGroup.Item className="d-flex justify-content-center p-3">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </ListGroup.Item>
            ) : (
              booksList.map((book) => (
                <ListGroup.Item as="li" className="d-flex" key={book.id}>
                  <Col xs={3} sm={2} md={1}>
                    <Image
                      src={book.imageLink || defaultBookImage}
                      alt={`${
                        book.imageLink ? book.title : 'Placeholder'
                      } Cover`}
                      thumbnail
                      className="mw-100"
                    />
                  </Col>
                  <Col className="ms-3">
                    <h5>
                      <Link to={`/books/${book.id}`}>{book.title}</Link>
                    </h5>
                    {book.authors && <h6>{book.authors[0]}</h6>}
                  </Col>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        )}
      </Col>
    </Row>
  );

  async function handleBookSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const { search } = e.target as typeof e.target & {
      search: { value: string };
    };
    const response = await fetch(`${API_BASE_URL}/books?title=${search.value}`);
    const data = await response.json();
    setBooksList(data);
    setLoading(false);
  }
};
