import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Character } from './Character';
import {
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  FloatingLabel,
} from 'react-bootstrap';
import type { Character as CharacterI } from '../../../types';
import { API_BASE_URL } from '../../../constants';

interface CharacterProps {
  bookId: string;
}

export const CharactersSection = ({ bookId }: CharacterProps) => {
  const [characters, setCharacters] = useState<CharacterI[]>([]);
  const [addingCharacter, setAddingCharacter] = useState<Boolean>(false);

  useEffect(() => {
    fetchCharacters();

    async function fetchCharacters() {
      const response = await fetch(`${API_BASE_URL}/characters/book/${bookId}`);
      const data = await response.json();
      console.log(data);
      setCharacters(data);
    }
  }, [bookId]);

  return (
    <Row className="justify-content-center text-center" as="section">
      <h4>Characters</h4>
      <hr />
      <Row>
        {characters.map((character) => (
          <Character name={character.name} key={character.id} />
        ))}
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Button
            onClick={toggleAddingCharacter}
            variant={!addingCharacter ? 'primary' : 'secondary'}
          >
            {!addingCharacter ? '+ Add Character' : 'Cancel'}
          </Button>
          {addingCharacter && (
            <Form className="mt-3" onSubmit={handleCharacterSubmit}>
              <InputGroup>
                <FloatingLabel controlId="character" label="Character name">
                  <Form.Control type="text" placeholder="Ponyboy Curtis" />
                </FloatingLabel>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </InputGroup>
            </Form>
          )}
        </Col>
      </Row>
    </Row>
  );

  function toggleAddingCharacter() {
    setAddingCharacter((prevState) => !prevState);
  }

  function handleCharacterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // const { character } = e.target as typeof e.target & {
    //   character: { value: string };
    // };

    // setCharacters((prevCharacters) => [
    //   ...prevCharacters,
    //   { name: character.value },
    // ]);
    setAddingCharacter(false);
  }
};
