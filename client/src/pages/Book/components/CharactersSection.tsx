import type { FormEvent } from 'react';
import { Character } from './Character';
import { InputBar } from '../../../components';
import { Row, Col, Button } from 'react-bootstrap';
import { useCharacters } from '../../../hooks/useCharacters';

interface CharacterProps {
  bookId: string;
}

export const CharactersSection = ({ bookId }: CharacterProps) => {
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
