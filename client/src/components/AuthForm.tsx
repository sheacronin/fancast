import { Form, Button } from 'react-bootstrap';
import { useAuth, useAuthDispatch } from '../context';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { ChangeEvent } from 'react';

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
    username: yup
      .string()
      .required('Username must not be empty.')
      .min(3, 'Username must be at least 3 characters.')
      .max(18, 'Username must be no more than 18 characters.'),
    password: yup
      .string()
      .required('Password must not be empty.')
      .min(3, 'Password must be at least 3 characters.'),
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

  const { errors: resErrors } = useAuth();
  const { clearErrors: clearResErrors } = useAuthDispatch();

  return (
    <Form
      noValidate
      onSubmit={handleSubmit}
      className="bg-dark text-light p-4 rounded"
    >
      <h2 className="h4">{formTitle}</h2>
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          value={values.username}
          onChange={handleChangeAndClearResErrors}
          isValid={isValid('username')}
          isInvalid={isInvalid('username')}
        />
        <Form.Control.Feedback type="invalid">
          {renderErrors('username')}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChangeAndClearResErrors}
          isValid={isValid('password')}
          isInvalid={isInvalid('password')}
        />
        <Form.Control.Feedback type="invalid">
          {renderErrors('password')}
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
            onChange={handleChangeAndClearResErrors}
            isValid={isValid('confirmPassword') && isValid('password')}
            isInvalid={isInvalid('confirmPassword')}
          />
          <Form.Control.Feedback type="invalid">
            {renderErrors('confirmPassword')}
          </Form.Control.Feedback>
        </Form.Group>
      )}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );

  function handleChangeAndClearResErrors(e: ChangeEvent) {
    clearResErrors();
    handleChange(e);
  }

  function renderErrors(field: keyof typeof values) {
    const messages = [];
    const inputError = errors[field];
    if (inputError) {
      messages.push(inputError);
    }
    if (!!resErrors && !!resErrors[field] && resErrors[field].length > 0) {
      messages.push(...resErrors[field]);
    }

    return messages.map((msg) => (
      <p key={msg} className="mb-1">
        {msg}
      </p>
    ));
  }

  function isValid(field: keyof typeof values) {
    return (
      touched[field] &&
      !errors[field] &&
      (!resErrors || !resErrors[field] || resErrors[field].length === 0)
    );
  }

  function isInvalid(field: keyof typeof values) {
    return (
      touched[field] &&
      (!!errors[field] ||
        (!!resErrors && resErrors[field] && resErrors[field].length > 0))
    );
  }
};
