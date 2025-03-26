import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Container, Badge } from 'react-bootstrap';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/notifications/')
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container>
      <h1 className="my-4">
        Notifications <Badge bg="secondary">{notifications.length}</Badge>
      </h1>
      <Card>
        <ListGroup variant="flush">
          {notifications.map(notification => (
            <ListGroup.Item key={notification.id}>
              <div>{notification.message}</div>
              <small className="text-muted">
                {new Date(notification.timestamp).toLocaleString()}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default Notifications;