import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Character } from './Character';
import { InputBar } from '../../../components';
import { Row, Col, Button } from 'react-bootstrap';
import { useCharacters } from '../../../hooks/useCharacters';
import { useAuth } from '../../../context';

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
              <InputBar
                handleSubmit={handleCharacterSubmit}
                controlId="characterName"
                label="Character name"
                placeholder="Ponyboy Curtis"
                buttonText="Submit"
                floatingLabel
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

  function handleCharacterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { characterName } = e.target as typeof e.target & {
      characterName: { value: string };
    };

    const character = {
      name: characterName.value,
      actorIds: [],
      bookId,
    };

    addCharacter(character);
  }
};
