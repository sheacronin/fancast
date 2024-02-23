import { useState, useEffect } from 'react';
import { Col, Image, Dropdown } from 'react-bootstrap';
import type { Cast } from '../../../types';
import { API_BASE_URL } from '../../../constants';

interface CharacterProps {
  id: string;
  name: string;
}

export const Character = ({ id, name }: CharacterProps) => {
  const [castings, setCastings] = useState<Cast[]>([]);
  const [selectedCastId, setSelectedCastId] = useState<string | null>(null);

  const selectedCast = castings.find((cast) => cast.id === selectedCastId);

  useEffect(() => {
    fetchCast();

    async function fetchCast() {
      const response = await fetch(`${API_BASE_URL}/cast/character/${id}`);
      const data = await response.json();
      console.log(data);
      setCastings(data);
    }
  }, [id]);

  return (
    <Col xs={12} md={6} lg={4} className="p-3">
      <p>{name}</p>
      <Image
        src={
          selectedCast
            ? selectedCast.imageLink
            : 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg'
        }
        alt={selectedCast ? selectedCast.name : 'Unknown person'}
        className="w-50"
        rounded
      />
      <Dropdown className="mt-3" onSelect={selectCasting}>
        <Dropdown.Toggle variant="light">
          {selectedCast ? selectedCast.name : <i>No casting selected</i>}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {castings.map((casting) => (
            <Dropdown.Item eventKey={casting.id} key={casting.id}>
              {casting.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Item>+ Add new casting</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  );

  function selectCasting(castId: string | null) {
    setSelectedCastId(castId);
  }
};
