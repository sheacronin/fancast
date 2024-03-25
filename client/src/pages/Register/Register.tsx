import type { FormEvent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { API_BASE_URL } from '../../constants';
import { AuthForm } from '../../components';

export const Register = () => {
  return (
    <Row className="justify-content-center">
      <Col xs={10} sm={8} md={6} lg={4}>
        <AuthForm
          formTitle="Create an account"
          handleSubmit={handleRegistration}
          confirmPassword
        />
      </Col>
    </Row>
  );

  async function handleRegistration(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { username, password, confirmPassword } =
      e.target as typeof e.target & {
        username: { value: string };
        password: { value: string };
        confirmPassword: { value: string };
      };
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });
    const data = await response.json();
    console.log(data);
  }
};
