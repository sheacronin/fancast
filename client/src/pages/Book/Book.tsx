import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import type { Book as BookI } from '../../types';
import { CharactersSection } from './components/CharactersSection';
import { API_BASE_URL } from '../../constants';

export const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState<BookI>();

  useEffect(() => {
    if (id) {
      const getBook = async () => {
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        const data = await response.json();
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
      <CharactersSection bookId={book.id} />
    </article>
  );
};
