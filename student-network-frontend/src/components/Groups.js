import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';

const Groups = () => {
  const [groups, setGroups] = useState([]);

  // Fetch groups
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/groups/')
      .then(res => setGroups(res.data))
      .catch(err => console.error(err));
  }, []);

  // Join a group
  const handleJoin = (groupId) => {
    axios.post(`http://127.0.0.1:8000/api/groups/${groupId}/join/`)
      .then(res => {
        setGroups(groups.map(group => 
          group.id === groupId ? res.data : group
        ));
      })
      .catch(err => console.error(err));
  };

  return (
    <Container>
      <h1 className="my-4">Groups</h1>
      <Row>
        {groups.map(group => (
          <Col key={group.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{group.name}</Card.Title>
                <Card.Text>{group.description}</Card.Text>
                <Button 
                  variant={group.members.includes(1) ? 'secondary' : 'primary'} // Hardcoded user ID for demo
                  onClick={() => handleJoin(group.id)}
                >
                  {group.members.includes(1) ? 'Joined' : 'Join Group'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Groups;