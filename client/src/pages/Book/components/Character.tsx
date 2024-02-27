import { Col, Image, Dropdown } from 'react-bootstrap';
import { CastingModal } from './CastingModal';
import { useActors } from '../../../hooks/useActors';

interface CharacterProps {
  id: string;
  name: string;
}

export const Character = ({ id, name }: CharacterProps) => {
  const { actors, selectedActor, addingActor, selectActor, toggleAddingActor } =
    useActors(id);

  return (
    <Col xs={12} md={6} lg={4} className="p-3">
      <p>{name}</p>
      <Image
        src={selectedActor.imageLink}
        alt={selectedActor.name}
        className="w-50"
        rounded
      />
      <Dropdown
        className="mt-3"
        onSelect={(eventKey) => {
          if (eventKey) {
            eventKey === 'ADD'
              ? toggleAddingActor(true)
              : selectActor(eventKey);
          }
        }}
      >
        <Dropdown.Toggle variant="light">
          {selectedActor.id === 'PLACEHOLDER' ? (
            <i>No casting selected</i>
          ) : (
            selectedActor.name
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {actors.map((actor) => (
            <Dropdown.Item eventKey={actor.id} key={actor.id}>
              {actor.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Item eventKey="ADD">+ Add new casting</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <CastingModal
        show={addingActor}
        hide={() => toggleAddingActor(false)}
        characterId={id}
      />
    </Col>
  );
};
