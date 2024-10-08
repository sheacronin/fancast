import type { FormEvent } from 'react';
import { Modal, ListGroup, Col, Spinner } from 'react-bootstrap';
import { SearchBar, ActorImage } from '../../../components';
import type { Actor as IActor, Casting } from '../../../types';
import { useActorSearch } from '../../../hooks/useActorSearch';

interface CastingModalProps {
  show: boolean;
  hide: () => void;
  addActor: (actorId: number) => Promise<void>;
  castings: Casting[];
}

export const CastingModal = ({
  show,
  hide,
  addActor,
  castings,
}: CastingModalProps) => {
  const { searchResults, hasSearched, loading, searchActors, clearSearch } =
    useActorSearch();

  return (
    <Modal show={show} onHide={handleHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add a Casting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchBar
          handleSubmit={handleSearchSubmit}
          controlId="actorSearch"
          label="Actor search"
          placeholder="Firstname Lastname"
        />
        {hasSearched && (
          <ListGroup variant="flush" className="border rounded-bottom">
            {loading ? (
              <ListGroup.Item className="d-flex justify-content-center p-3">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </ListGroup.Item>
            ) : searchResults.length > 0 ? (
              searchResults.map((actor) => {
                const castingExists = castings.some(
                  (casting) => casting.actorId === actor.id
                );
                return (
                  <Actor
                    actor={actor}
                    addActor={handleAddActor}
                    key={actor.id}
                    castingExists={castingExists}
                  />
                );
              })
            ) : (
              <ListGroup.Item>No results found.</ListGroup.Item>
            )}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );

  async function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { actorSearch } = e.target as typeof e.target & {
      actorSearch: { value: string };
    };
    searchActors(actorSearch.value);
  }

  async function handleAddActor(actor: IActor) {
    await addActor(actor.id);
    handleHide();
  }

  function handleHide() {
    hide();
    clearSearch();
  }
};

interface ActorProps {
  actor: IActor;
  addActor: (actor: IActor) => Promise<void>;
  castingExists: boolean;
}

const Actor = ({ actor, addActor, castingExists }: ActorProps) => {
  return (
    <ListGroup.Item
      action
      onClick={() => addActor(actor)}
      variant={!castingExists ? 'primary' : 'danger'}
      className={'d-flex' + (castingExists ? ' bg-danger-subtle' : '')}
      disabled={castingExists}
    >
      <Col xs={3}>
        <ActorImage actor={actor} thumbnail />
      </Col>
      <Col className="ms-3">
        <h5>{actor.name}</h5>
        {castingExists && (
          <p>This actor has already been cast for this character.</p>
        )}
      </Col>
    </ListGroup.Item>
  );
};
