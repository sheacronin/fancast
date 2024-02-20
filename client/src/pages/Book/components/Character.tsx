import { Col, Image, Dropdown } from 'react-bootstrap';

interface CharacterProps {
  name: string;
}

export const Character = ({ name }: CharacterProps) => {
  return (
    <Col xs={12} md={6} lg={4} className="p-3">
      <p>{name}</p>
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
        alt="Unknown person"
        className="w-50"
        rounded
      />
      <Dropdown className="mt-3">
        <Dropdown.Toggle variant="light">
          <i>No casting selected</i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Actor A</Dropdown.Item>
          <Dropdown.Item>Actor B</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  );
};
