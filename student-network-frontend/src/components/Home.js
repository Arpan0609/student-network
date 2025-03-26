import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5 p-5 bg-light rounded">
      <h1>Welcome to Student Network</h1>
      <p>
        Connect with fellow students, share ideas, and grow together.
      </p>
      <p>
        <Button as={Link} to="/profile" variant="primary">
          View Profile
        </Button>
      </p>
    </Container>
  );
};

export default Home;