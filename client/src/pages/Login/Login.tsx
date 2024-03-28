import { Row, Col } from 'react-bootstrap';
import { AuthForm } from '../../components';
import { useAuthDispatch } from '../../context';
import type { AuthInputs } from '../../components';

export const Login = () => {
  const { login } = useAuthDispatch();

  return (
    <Row className="justify-content-center">
      <Col xs={10} sm={8} md={6} lg={4}>
        <AuthForm formTitle="Login" onSubmit={handleLogin} />
      </Col>
    </Row>
  );

  async function handleLogin(inputs: AuthInputs) {
    const { username, password } = inputs;
    login(username, password);
  }
};
