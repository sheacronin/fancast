import { useState } from 'react';

export interface ResponseErrors {
  [field: string]: string[];
}

export const useResponseErrors = () => {
  const [errors, setErrors] = useState<ResponseErrors | null>(null);

  const setResErrors = (errors: ResponseErrors) => {
    const snakeCaseErrors = Object.fromEntries(
      Object.entries(errors).map(([field, message]) => [
        field.charAt(0).toLowerCase() + field.slice(1),
        message,
      ])
    );
    setErrors(snakeCaseErrors);
  };

  const clearErrors = () => setErrors(null);

  return { errors, setResErrors, clearErrors };
};
