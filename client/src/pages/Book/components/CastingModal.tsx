import { useState } from 'react';
import type { FormEvent } from 'react';
import { Modal, Button, ListGroup, Col, Image } from 'react-bootstrap';
import { InputBar } from '../../../components';
import type { Cast } from '../../../types';
import { API_BASE_URL } from '../../../constants';

interface AddCastModalProps {
  show: boolean;
  hide: () => void;
  characterId: string;
}

export const CastingModal = ({
  show,
  hide,
  characterId,
}: AddCastModalProps) => {
  const [searchResults, setSearchResults] = useState<Cast[]>([]);

  return (
    <Modal show={show} onHide={handleHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Add a Casting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputBar
          handleSubmit={searchActors}
          controlId="actorSearch"
          label="Actor search"
          placeholder="Firstname Lastname"
        />
        {searchResults.length > 0 && (
          <ListGroup variant="flush" className="border rounded-bottom">
            {searchResults.map((actor) => (
              <Actor actor={actor} addCasting={addCasting} key={actor.id} />
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={console.log}>
          Close
        </Button>
        <Button variant="primary" onClick={console.log}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  async function searchActors(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { actorSearch } = e.target as typeof e.target & {
      actorSearch: { value: string };
    };
    const response = await fetch(
      `${API_BASE_URL}/cast/search/${actorSearch.value}`
    );
    const data = await response.json();
    console.log(data);
    setSearchResults(data);
  }

  async function addCasting(actorId: string) {
    await fetch(`${API_BASE_URL}/characters/${characterId}/addCasting`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actorId),
    });
    handleHide();
  }

  function handleHide() {
    hide();
    setSearchResults([]);
  }
};

interface ActorProps {
  actor: Cast;
  addCasting: (actorId: string) => Promise<void>;
}

const Actor = ({ actor, addCasting }: ActorProps) => {
  return (
    <ListGroup.Item
      action
      onClick={() => addCasting(actor.id)}
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
