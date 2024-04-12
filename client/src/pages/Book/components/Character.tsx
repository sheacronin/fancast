import {
  Col,
  Image,
  Dropdown,
  Spinner,
  Ratio,
  Placeholder,
} from 'react-bootstrap';
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
    loading,
    selectCasting,
    toggleAddingCasting,
    addCasting,
  } = useCastings(id, user && user.id);

  const loadingUI = (
    <>
      <div className="w-50 m-auto">
        <Ratio aspectRatio={150}>
          <div className="border rounded d-flex justify-content-center align-items-center bg-secondary-subtle">
            <Spinner animation="border" role="status" variant="secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </Ratio>
      </div>
      <Placeholder as={Dropdown} animation="wave" className="mt-3">
        <Placeholder.Button xs={8} variant="secondary" />
      </Placeholder>
    </>
  );

  return (
    <Col xs={12} md={6} lg={4} className="p-3">
      <h5 className="text-uppercase">{name}</h5>
      {loading ? (
        loadingUI
      ) : (
        <>
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
                <Dropdown.Item
                  eventKey={casting.id}
                  key={casting.id}
                  disabled={casting.id === selectedCasting.id}
                  className={
                    casting.id === selectedCasting.id ? 'bg-primary-subtle' : ''
                  }
                >
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
            castings={castings}
          />
        </>
      )}
    </Col>
  );
};
