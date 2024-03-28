import { Row, Col } from 'react-bootstrap';
import { AuthForm } from '../../components';
import { useAuthDispatch } from '../../context';
import type { AuthInputs } from '../../components';

export const Register = () => {
  const { register } = useAuthDispatch();

  return (
    <Row className="justify-content-center">
      <Col xs={10} sm={8} md={6} lg={4}>
        <AuthForm
          formTitle="Create an account"
          onSubmit={handleRegistration}
          confirmPassword
        />
      </Col>
    </Row>
  );

  async function handleRegistration(inputs: AuthInputs) {
    const { username, password, confirmPassword } = inputs;
    register(username, password, confirmPassword!);
  }
};
