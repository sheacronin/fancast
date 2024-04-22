import { Link } from 'react-router-dom';
import { Col, ListGroup, Spinner, Image } from 'react-bootstrap';
import { InputBar } from '../../../components';
import { useBookSearch } from '../../../hooks/useBookSearch';
import defaultBookImage from '../../../assets/default_book.jpg';
import type { FormEvent } from 'react';

export const BookSearch = () => {
  const { searchResults, hasSearched, loading, searchBooks, clearSearch } =
    useBookSearch();

  return (
    <Col md={8} className="position-relative">
      <InputBar
        handleSubmit={handleSearchSubmit}
        controlId="search"
        label="Book search"
        placeholder="Book title"
        searchClearIcons
        showClear={hasSearched}
        clearEffect={clearSearch}
      />
      {hasSearched && (
        <ListGroup
          as="ul"
          variant="flush"
          className="z-1 position-absolute start-0 end-0 mx-3 border rounded-bottom shadow"
        >
          {loading ? (
            <ListGroup.Item className="d-flex justify-content-center p-3">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </ListGroup.Item>
          ) : searchResults.length > 0 ? (
            searchResults.map((book) => (
              <ListGroup.Item as="li" className="d-flex" key={book.id}>
                <Col xs={3} sm={2} md={1}>
                  <Image
                    src={book.imageLink || defaultBookImage}
                    alt={`${book.imageLink ? book.title : 'Placeholder'} Cover`}
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
          ) : (
            <ListGroup.Item className="text-secondary-dark text-center">
              No results found.
            </ListGroup.Item>
          )}
          <ListGroup.Item variant="info" className="text-end fs-7">
            <Link to="https://www.google.com/" target="_blank">
              <Image
                src="https://books.google.com/googlebooks/images/poweredby.png"
                alt="Powered by Google"
                width={50}
              />
            </Link>
          </ListGroup.Item>
        </ListGroup>
      )}
    </Col>
  );

  async function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { search } = e.target as typeof e.target & {
      search: { value: string };
    };

    searchBooks(search.value);
  }
};
