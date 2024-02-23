import { useState } from 'react';
import type { FormEvent } from 'react';
import { Row, Col, ListGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { InputBar } from '../../components';
import type { Book } from '../../types';
import { API_BASE_URL } from '../../constants';

export const Home = () => {
  const [booksList, setBooksList] = useState<Book[]>([]);

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <InputBar
          handleSubmit={handleBookSearch}
          controlId="search"
          label="Book search"
          placeholder="Book title"
          buttonText="Search"
        />
        {booksList.length > 0 && (
          <ListGroup as="ul" variant="flush" className="border rounded-bottom">
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
                  <h5>
                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                  </h5>
                  {book.authors && <h6>{book.authors[0]}</h6>}
                </Col>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
    </Row>
  );

  async function handleBookSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { search } = e.target as typeof e.target & {
      search: { value: string };
    };
    const response = await fetch(
      `${API_BASE_URL}/books/search/${search.value}`
    );
    const data = await response.json();
    console.log(data);
    setBooksList(data);
  }
};
