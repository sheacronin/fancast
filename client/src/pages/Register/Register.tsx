import type { FormEvent } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AuthForm } from '../../components';
import { useAuthDispatch } from '../../context';

export const Register = () => {
  const { register } = useAuthDispatch();

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

    register(username.value, password.value, confirmPassword.value);
  }
};
