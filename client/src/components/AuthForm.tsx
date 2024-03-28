import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useAuth } from '../context';
import type { FormEvent } from 'react';

interface AuthFormProps {
  formTitle: string;
  onSubmit: (inputs: AuthInputs) => void;
  confirmPassword?: boolean;
}

export interface AuthInputs {
  username: string;
  password: string;
  confirmPassword?: string;
}

export const AuthForm = ({
  formTitle,
  onSubmit,
  confirmPassword = false,
}: AuthFormProps) => {
  const [validated, setValidated] = useState(false);
  const { error } = useAuth();

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className="bg-dark text-light p-4 rounded"
    >
      <h2 className="h4">{formTitle}</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control required placeholder="Enter username" />
        <Form.Control.Feedback type="invalid">
          Username must not be empty.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" placeholder="Password" />
        <Form.Control.Feedback type="invalid">
          Password must not be empty.
        </Form.Control.Feedback>
      </Form.Group>
      {confirmPassword && (
        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Confirm Password"
          />
          <Form.Control.Feedback type="invalid">
            Password must not be empty.
          </Form.Control.Feedback>
        </Form.Group>
      )}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const { username, password, confirmPassword } = form;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const inputs = {
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword?.value,
      };
      onSubmit(inputs);
    }

    setValidated(true);
  }
};
