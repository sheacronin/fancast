import { Col, Image, Dropdown } from 'react-bootstrap';
import { CastingModal } from './CastingModal';
import { useCastings } from '../../../hooks/useCastings';
import { useAuth } from '../../../context';

interface CharacterProps {
  id: number;
  name: string;
}

export const Character = ({ id, name }: CharacterProps) => {
  const { user } = useAuth();
  const {
    castings,
    selectedCasting,
    addingCasting,
    selectCasting,
    toggleAddingCasting,
    addCasting,
  } = useCastings(id, user && user.id);
  console.log(selectedCasting);

  return (
    <Col xs={12} md={6} lg={4} className="p-3">
      <p>{name}</p>
      <Image
        src={selectedCasting.actor.imageLink}
        alt={selectedCasting.actor.name}
        className="w-50"
        rounded
      />
      <Dropdown
        className="mt-3"
        onSelect={(eventKey) => {
          if (eventKey) {
            eventKey === 'ADD'
              ? toggleAddingCasting(true)
              : selectCasting(parseInt(eventKey));
          }
        }}
      >
        <Dropdown.Toggle variant="light">
          {selectedCasting.id === -1 ? (
            <i>No casting selected</i>
          ) : (
            selectedCasting.actor.name
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {castings.map((casting) => (
            <Dropdown.Item eventKey={casting.id} key={casting.id}>
              {casting.actor.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Item eventKey="ADD">+ Add new casting</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <CastingModal
        show={addingCasting}
        hide={() => toggleAddingCasting(false)}
        addActor={addCasting}
      />
    </Col>
  );
};
