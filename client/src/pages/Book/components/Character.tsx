import {
  Col,
  Dropdown,
  Spinner,
  Ratio,
  Placeholder,
  Carousel,
} from 'react-bootstrap';
import { CastingModal } from './CastingModal';
import { ActorImage } from '../../../components';
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

  const unauthUI = (
    <Carousel
      variant="dark"
      indicators={false}
      className={
        'custom-carousel' + (castings.length === 1 ? ' single-carousel' : '')
      }
    >
      {castings.map(({ id, actor }) => (
        <Carousel.Item key={id}>
          <ActorImage actor={actor} width={50} />
          <p className="mt-4 mb-0">{actor.name}</p>
        </Carousel.Item>
      ))}
    </Carousel>
  );

  return (
    <Col xs={12} md={6} lg={4} className="p-3">
      <h5 className="text-uppercase">{name}</h5>
      {loading ? (
        loadingUI
      ) : user === null ? (
        unauthUI
      ) : (
        <>
          <ActorImage actor={selectedCasting.actor} width={50} />
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
