import type { FormEventHandler } from 'react';
import { Form, InputGroup, Button, CloseButton, Image } from 'react-bootstrap';
import searchSvg from '../assets/search_icon.svg';

interface SearchBarProps {
  handleSubmit: FormEventHandler;
  controlId: string;
  label: string;
  placeholder: string;
  searchClearIcons?: boolean;
  showClear?: boolean;
  clearEffect?: () => void;
}

export const SearchBar = ({
  handleSubmit,
  controlId,
  label,
  placeholder,
  searchClearIcons = false,
  showClear = false,
  clearEffect,
}: SearchBarProps) => {
  // The following icons will be used if the searchClearIcons prop is true
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
      <Form.Group controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <InputGroup>
          {searchClearIcons && (showClear ? clearButton : searchIcon)}
          <Form.Control
            type="text"
            placeholder={placeholder}
            className={searchClearIcons ? 'z-2 rounded-start ps-5' : ''}
          />
          <Button variant="primary" type="submit">
            Search
          </Button>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};
