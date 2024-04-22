import { Row } from 'react-bootstrap';
import { BookSearch } from './components/BookSearch';
import { RecentCastings } from './components/RecentCastings';

export const Home = () => (
  <>
    <Row className="justify-content-center">
      <BookSearch />
    </Row>
    <Row className="my-5">
      <RecentCastings />
    </Row>
  </>
);
