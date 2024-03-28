import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../context';
import { useFormik } from 'formik';
import * as yup from 'yup';

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
  const validationSchema = yup.object({
    username: yup.string().required('Username must not be empty.'),
    password: yup.string().required('Password must not be empty.'),
    confirmPassword: confirmPassword
      ? yup
          .string()
          .required('Password confirmation must not be empty.')
          .oneOf([yup.ref('password')], 'Passwords must match.')
      : yup.string(),
  });
  const { handleSubmit, handleChange, values, touched, errors } = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  const { error: authRequestError } = useAuth();

  return (
    <Form
      noValidate
      onSubmit={handleSubmit}
      className="bg-dark text-light p-4 rounded"
    >
      <h2 className="h4">{formTitle}</h2>
      {authRequestError && <p className="text-danger">{authRequestError}</p>}
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          value={values.username}
          onChange={handleChange}
          isValid={touched.username && !errors.username}
          isInvalid={touched.username && !!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          isValid={touched.password && !errors.password}
          isInvalid={touched.password && !!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      {confirmPassword && (
        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={handleChange}
            isValid={touched.confirmPassword && !errors.confirmPassword}
            isInvalid={touched.password && !!errors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
      )}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
