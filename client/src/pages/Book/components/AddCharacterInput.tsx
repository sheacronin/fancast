import { Form, InputGroup, FloatingLabel, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { Character } from '../../../types';

interface AddCharacterInputProps {
  characters: Character[];
  addCharacter: (character: Omit<Character, 'id'>) => Promise<void>;
  bookId: string;
}

interface CharacterInputs {
  characterName: string;
}

export const AddCharacterInput = ({
  characters,
  addCharacter,
  bookId,
}: AddCharacterInputProps) => {
  const validationSchema = yup.object({
    characterName: yup
      .string()
      .required('Character name must not be empty.')
      .uppercase()
      .notOneOf(
        characters.map((c) => c.name.toUpperCase()),
        'A character with this name already exists for this book.'
      ),
  });
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: { characterName: '' },
    validationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  const isInvalid = touched.characterName && !!errors.characterName;

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup hasValidation>
        <FloatingLabel
          controlId="characterName"
          label="Character name"
          className={isInvalid ? 'is-invalid' : ''}
        >
          <Form.Control
            type="text"
            placeholder="Ponyboy Curtis"
            value={values.characterName}
            onChange={handleChange}
            isValid={touched.characterName && !errors.characterName}
            isInvalid={isInvalid}
          />
        </FloatingLabel>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Form.Control.Feedback
          type="invalid"
          className="ms-1 text-start text-danger-dark"
        >
          {errors.characterName}
        </Form.Control.Feedback>
      </InputGroup>
    </Form>
  );

  function onSubmit({ characterName }: CharacterInputs) {
    const character = {
      name: characterName,
      actorIds: [],
      bookId,
    };

    addCharacter(character);
  }
};
