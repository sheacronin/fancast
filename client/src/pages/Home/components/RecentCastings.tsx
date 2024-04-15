import { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Stack, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../context';
import type { Casting, User } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import { Link } from 'react-router-dom';

export const RecentCastings = () => {
  const { user } = useAuth();
  const [castings, setCastings] = useState<Casting[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentCastings(user)
      .then((result) => {
        setCastings(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    async function fetchRecentCastings(user: User | null, limit: number = 10) {
      setLoading(true);
      const userIdQuery = user !== null ? `userId=${user.id}&` : '';

      const response = await fetch(
        `${API_BASE_URL}/castings?${userIdQuery}limit=${limit}`,
        {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      return await response.json();
    }
  }, [user]);

  return (
    <Col as="section" className="text-center">
      <h4>Recent Castings</h4>
      <hr />

      {loading ? (
        <Spinner animation="border" role="status" className="mt-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <Row
          xs={1}
          sm={2}
          md={3}
          xl={4}
          className="row-gap-3 align-items-stretch"
        >
          {castings.map(({ id, book, character, actor, users }) => (
            <Col key={id}>
              <Card as="article" className="h-100">
                <div className="d-flex">
                  <Card.Img
                    src={book!.imageLink}
                    variant="top"
                    className="w-50 object-fit-cover"
                    style={{ borderTopRightRadius: 0 }}
                  />
                  <Card.Img
                    src={actor.imageLink}
                    variant="top"
                    className="w-50 object-fit-cover"
                    style={{ borderTopLeftRadius: 0 }}
                  />
                </div>
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Card.Title as="h6">
                    {actor.name} as {character!.name}
                  </Card.Title>
                  <Card.Text>
                    <Link to={`/books/${book!.id}`}>{book!.title}</Link>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {users!.slice(0, 6).map((u) => (
                      <Badge
                        key={u.id}
                        bg="primary"
                        pill
                        className="text-uppercase"
                      >
                        {u.username}
                      </Badge>
                    ))}
                    {users!.length > 7 && (
                      <Badge bg="primary" pill className="text-uppercase">
                        ...
                      </Badge>
                    )}
                  </Stack>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Col>
  );
};
