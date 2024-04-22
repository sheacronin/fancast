import type { FormEventHandler } from 'react';
import {
  Form,
  InputGroup,
  FloatingLabel,
  Button,
  CloseButton,
  Image,
} from 'react-bootstrap';
import searchSvg from '../assets/search_icon.svg';

interface InputBarProps {
  handleSubmit: FormEventHandler;
  controlId: string;
  label: string;
  placeholder: string;
  buttonText?: string;
  floatingLabel?: boolean;
  searchClearIcons?: boolean;
  showClear?: boolean;
  clearEffect?: () => void;
}

export const InputBar = ({
  handleSubmit,
  controlId,
  label,
  placeholder,
  buttonText = 'Search',
  floatingLabel = false,
  searchClearIcons = false,
  showClear = false,
  clearEffect,
}: InputBarProps) => {
  const formControl = (
    <Form.Control
      type="text"
      placeholder={placeholder}
      className={searchClearIcons ? 'z-2 rounded-start ps-5' : ''}
    />
  );
  const button = (
    <Button variant="primary" type="submit">
      {buttonText}
    </Button>
  );

  // The following icons will be used if the searchClearIcons prop is true
  // and if the floatingLabel prop is false
  const searchIcon = (
    <Image
      src={searchSvg}
      alt="search icon"
      className="z-3 position-absolute top-50 start-0 translate-middle-y p-1 ms-2 rounded opacity-50"
    />
  );
  const clearButton = (
    <CloseButton
      onClick={(e) => {
        const input = (e.target as HTMLFormElement).form[controlId];
        input.value = '';
        if (clearEffect) {
          clearEffect();
        }
      }}
      className="z-3 position-absolute top-50 start-0 translate-middle-y ms-2 rounded"
    />
  );

  return (
    <Form onSubmit={handleSubmit}>
      {floatingLabel ? (
        <InputGroup>
          <FloatingLabel controlId={controlId} label={label}>
            {formControl}
          </FloatingLabel>
          {button}
        </InputGroup>
      ) : (
        <Form.Group controlId={controlId}>
          <Form.Label>{label}</Form.Label>
          <InputGroup>
            {searchClearIcons && (showClear ? clearButton : searchIcon)}
            {formControl}
            {button}
          </InputGroup>
        </Form.Group>
      )}
    </Form>
  );
};
