import { Link } from 'react-router-dom';
import { Character } from './Character';
import { Row, Col, Button } from 'react-bootstrap';
import { useCharacters } from '../../../hooks/useCharacters';
import { useAuth } from '../../../context';
import { AddCharacterInput } from './AddCharacterInput';

interface CharacterProps {
  bookId: string;
}

export const CharactersSection = ({ bookId }: CharacterProps) => {
  const { user } = useAuth();
  const { characters, addingCharacter, addCharacter, toggleAddingCharacter } =
    useCharacters(bookId);

  return (
    <Row className="justify-content-center text-center" as="section">
      <h4>Characters</h4>
      <hr />
      <Row>
        {characters.map((character) => (
          <Character
            id={character.id}
            name={character.name}
            key={character.id}
          />
        ))}
      </Row>
      <Row className="justify-content-center">
        {user !== null ? (
          <Col xs={12} md={8} lg={5}>
            <Button
              onClick={toggleAddingCharacter}
              variant={!addingCharacter ? 'primary' : 'secondary'}
              className="mb-3"
            >
              {!addingCharacter ? '+ Add Character' : 'Cancel'}
            </Button>
            {addingCharacter && (
              <AddCharacterInput
                characters={characters}
                addCharacter={addCharacter}
                bookId={bookId}
              />
            )}
          </Col>
        ) : (
          <Col>
            <p className="mt-4 text-info fw-light">
              <Link to="/login" className="fw-bold">
                Login
              </Link>{' '}
              to add characters and select your own castings!
            </p>
          </Col>
        )}
      </Row>
    </Row>
  );
};
