import { useState, useEffect, useMemo, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, Ratio, Spinner, Placeholder } from 'react-bootstrap';
import type { Book as IBook } from '../../types';
import { CharactersSection } from './components/CharactersSection';
import { API_BASE_URL } from '../../constants';

export const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState<IBook>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const getBook = async () => {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/books/${id}`);
        const data = await response.json();
        setBook(data);
        setLoading(false);
      };
      getBook();
    }
  }, [id]);

  const paragraphPlaceholders = useMemo(() => {
    return generateParagraphPlaceholders(20);

    function generateParagraphPlaceholders(n: number) {
      const placeholders = [];
      let key = 1;

      while (n > 0) {
        const placeholderWidth = getRandomInt(2, 6);
        placeholders.push(
          <Fragment key={key}>
            <Placeholder xs={placeholderWidth} />{' '}
          </Fragment>
        );
        n--;
        key++;
      }

      return placeholders;
    }

    function getRandomInt(min: number, max: number) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      // The maximum is exclusive and the minimum is inclusive
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
    }
  }, []);

  const loadingUI = (
    <>
      <Placeholder as="h2" animation="glow">
        <Placeholder xs={4} />
      </Placeholder>
      <Placeholder as="h3" animation="glow">
        <Placeholder xs={5} />
      </Placeholder>
      <Col xs={12} sm={6} md={5} lg={3} className="mb-2">
        <Ratio aspectRatio={150}>
          <div className="border rounded d-flex justify-content-center align-items-center bg-secondary-subtle">
            <Spinner animation="border" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </Ratio>
      </Col>
      <Col>
        <Placeholder as="p" animation="glow">
          {paragraphPlaceholders}
        </Placeholder>
      </Col>
    </>
  );

  return (
    <article>
      <Row className="justify-content-center" as="section">
        {loading || !book ? (
          loadingUI
        ) : (
          <>
            <h2>{book.title}</h2>
            {book.authors && <h3>{book.authors.join(', ')}</h3>}
            <Col xs={12} sm={6} md={5} lg={3} className="mb-2 text-center">
              <Image
                src={book.imageLink}
                alt={`${book.title} Cover`}
                fluid
                rounded
              />
              <Link
                to={`https://www.google.com/books/edition/_/${id}`}
                target="_blank"
                className="d-block mt-3 fs-7 text-info"
              >
                Google Books Page
              </Link>
            </Col>
            <Col>
              {book.description && (
                <p dangerouslySetInnerHTML={{ __html: book.description }}></p>
              )}
            </Col>
          </>
        )}
      </Row>
      {id && <CharactersSection bookId={id} />}
    </article>
  );
};
