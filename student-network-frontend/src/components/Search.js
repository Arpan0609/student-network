import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const Search = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <Container className="my-4">
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="searchQuery">
          <Form.Control
            type="text"
            placeholder="Search for students..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-2">
          Search
        </Button>
      </Form>
    </Container>
  );
};

export default Search;