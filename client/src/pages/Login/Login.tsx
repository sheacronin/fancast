import { Row, Col } from 'react-bootstrap';
import { AuthForm } from '../../components';
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

    login(username.value, password.value);
  }
};
