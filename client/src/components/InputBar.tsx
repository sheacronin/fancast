import type { FormEventHandler } from 'react';
import { Form, InputGroup, FloatingLabel, Button } from 'react-bootstrap';

interface InputBarProps {
  handleSubmit: FormEventHandler;
  controlId: string;
  label: string;
  placeholder: string;
  buttonText?: string;
  floatingLabel?: boolean;
}

export const InputBar = ({
  handleSubmit,
  controlId,
  label,
  placeholder,
  buttonText = 'Search',
  floatingLabel = false,
}: InputBarProps) => {
  const formControl = <Form.Control type="text" placeholder={placeholder} />;
  const button = (
    <Button variant="primary" type="submit">
      {buttonText}
    </Button>
  );

  return (
    <Form onSubmit={handleSubmit}>
      {floatingLabel ? (
        <InputGroup>
          <FloatingLabel controlId={controlId} label={label}>
            {formControl}
          </FloatingLabel>
          {button}
        </InputGroup>
      ) : (
        <Form.Group controlId={controlId}>
          <Form.Label>{label}</Form.Label>
          <InputGroup>
            {formControl}
            {button}
          </InputGroup>
        </Form.Group>
      )}
    </Form>
  );
};
