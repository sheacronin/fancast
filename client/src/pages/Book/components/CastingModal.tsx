import type { FormEvent } from 'react';
import { Modal, ListGroup, Col, Image } from 'react-bootstrap';
import { InputBar } from '../../../components';
import type { Actor as IActor } from '../../../types';
import { useActorSearch } from '../../../hooks/useActorSearch';

interface CastingModalProps {
  show: boolean;
  hide: () => void;
  addActor: (actor: IActor) => Promise<void>;
}

export const CastingModal = ({ show, hide, addActor }: CastingModalProps) => {
  const { searchResults, hasSearched, searchActors, clearSearch } =
    useActorSearch();

  return (
    <Modal show={show} onHide={handleHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add a Casting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputBar
          handleSubmit={handleSearchSubmit}
          controlId="actorSearch"
          label="Actor search"
          placeholder="Firstname Lastname"
        />
        {hasSearched && (
          <ListGroup variant="flush" className="border rounded-bottom">
            {searchResults.length > 0 ? (
              searchResults.map((actor) => (
                <Actor actor={actor} addActor={handleAddActor} key={actor.id} />
              ))
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
    await addActor(actor);
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
}

const Actor = ({ actor, addActor }: ActorProps) => {
  return (
    <ListGroup.Item
      action
      onClick={() => addActor(actor)}
      variant="primary"
      className="d-flex"
    >
      <Col xs={3}>
        <Image src={actor.imageLink} alt={actor.name} thumbnail />
      </Col>
      <Col className="ms-3">
        <h5>{actor.name}</h5>
      </Col>
    </ListGroup.Item>
  );
};
