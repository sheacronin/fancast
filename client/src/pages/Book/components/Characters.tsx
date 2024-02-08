import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  FloatingLabel,
} from 'react-bootstrap';

export const Characters = () => {
  const [characters, setCharacters] = useState([{ name: 'Giovanni' }]);
  const [addingCharacter, setAddingCharacter] = useState<Boolean>(false);

  return (
    <Row className="justify-content-center text-center" as="section">
      <h4>Characters</h4>
      <hr />
      <Row>
        {characters.map((character) => (
          <Col xs={12} md={6} lg={4} className="p-3">
            {character.name}
          </Col>
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

    const { character } = e.target as typeof e.target & {
      character: { value: string };
    };

    setCharacters((prevCharacters) => [
      ...prevCharacters,
      { name: character.value },
    ]);
    setAddingCharacter(false);
  }
};
