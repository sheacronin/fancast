import { Row, Col } from 'react-bootstrap';
import { AuthForm } from '../../components';
import { API_BASE_URL } from '../../constants';
import { useAuthDispatch } from '../../context';
import type { FormEvent } from 'react';

export const Login = () => {
  const { login } = useAuthDispatch();

  return (
    <Row className="justify-content-center">
      <Col xs={10} sm={8} md={6} lg={4}>
        <AuthForm formTitle="Login" handleSubmit={handleLogin} />
      </Col>
    </Row>
  );

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { username, password } = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    // TODO: handle bad requests
    const user = await response.json();
    login(user);
  }
};
