import type { FormEvent } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../../constants';

export const Register = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={10} sm={8} md={6} lg={4}>
        <Form
          onSubmit={handleRegistration}
          className="bg-dark text-light p-3 rounded"
        >
          <h2 className="h4">Create an account</h2>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control placeholder="Enter username" />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );

  async function handleRegistration(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { username, password } = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    console.log(data);
  }
};
