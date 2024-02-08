import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import type { Book as BookI } from '../../types';
import { Characters } from './components/Characters';

export const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState<BookI>();

  useEffect(() => {
    if (id) {
      const getBook = async () => {
        const response = await fetch(id);
        const data = await response.json();
        console.log(data);
        setBook(data);
      };
      getBook();
    }
  }, [id]);

  if (!book) return null;

  return (
    <article>
      <Row className="justify-content-center" as="section">
        <h2>{book.title}</h2>
        {book.authors && <h3>{book.authors.join(', ')}</h3>}
        <Col xs={12} sm={6} md={5} lg={3} className="mb-2">
          <Image
            src={book.imageLink}
            alt={`${book.title} Cover`}
            fluid
            rounded
          />
        </Col>
        <Col>
          {book.description && (
            <p dangerouslySetInnerHTML={{ __html: book.description }}></p>
          )}
        </Col>
      </Row>
      <Characters />
    </article>
  );
};
