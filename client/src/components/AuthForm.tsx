import { Form, Button } from 'react-bootstrap';
import type { FormEventHandler } from 'react';
import { useAuth } from '../context';

interface AuthFormProps {
  formTitle: string;
  handleSubmit: FormEventHandler;
  confirmPassword?: boolean;
}

export const AuthForm = ({
  formTitle,
  handleSubmit,
  confirmPassword = false,
}: AuthFormProps) => {
  const { error } = useAuth();

  return (
    <Form onSubmit={handleSubmit} className="bg-dark text-light p-4 rounded">
      <h2 className="h4">{formTitle}</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control placeholder="Enter username" />
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      {confirmPassword && (
        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" />
        </Form.Group>
      )}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
