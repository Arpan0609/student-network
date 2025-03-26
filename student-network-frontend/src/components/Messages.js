import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); // Add selected user state
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]); // For selecting message recipient

  // Get CSRF token helper function
  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  // Fetch messages for selected user
  const fetchMessages = async () => {
    if (!selectedUserId) return;
    
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/messages/?receiver=${selectedUserId}`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Fetch messages error:', err);
    }
  };

  // Fetch available users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/profiles/',
        { withCredentials: true }
      );
      setUsers(response.data);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
    }
  }, [selectedUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/messages/',
        {
          content: newMessage,
          receiver: selectedUserId
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json'
          }
        }
      );
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (err) {
      setError('Failed to send message');
      console.error('Message send error:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Messages</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-3">
        <Card.Body>
          <h5>Select User</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {users.map(user => (
              <Button
                key={user.id}
                variant={selectedUserId === user.id ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.user.username}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {selectedUserId ? (
        <>
          <Card className="mb-3">
            <Card.Body style={{ height: '300px', overflowY: 'auto' }}>
              {messages.length > 0 ? (
                messages.map(message => (
                  <div 
                    key={message.id}
                    className={`mb-2 p-2 rounded ${message.sender === selectedUserId ? 'bg-light' : 'bg-primary text-white'}`}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>{message.sender === selectedUserId ? 
                        users.find(u => u.id === message.sender)?.user.username : 'You'}
                      </strong>
                      <small>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </small>
                    </div>
                    <p className="mb-0">{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No messages yet</p>
              )}
            </Card.Body>
          </Card>

          <Form onSubmit={handleSend}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Send
            </Button>
          </Form>
        </>
      ) : (
        <Card>
          <Card.Body className="text-center">
            <p>Please select a user to start messaging</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Messages;