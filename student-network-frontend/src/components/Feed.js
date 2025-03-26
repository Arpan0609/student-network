import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Form, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';

// CSRF Token helper
const getCSRFToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/posts/')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/posts/',
        { content: newPost },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCSRFToken(),
            'Content-Type': 'application/json'
          }
        }
      );
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Posting error:', err);
    }
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  return (
    <Container className="mt-4">
      <Card className="mb-4">
        <Card.Body>
          <h4>Create Post</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Post
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <h4 className="mb-3">Recent Posts</h4>
      {posts.length > 0 ? (
        posts.map(post => (
          <Card key={post.id} className="mb-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-2">
                <div className="bg-primary rounded-circle me-2" style={{ width: '40px', height: '40px' }}></div>
                <div>
                  <h6 className="mb-0">{post.user.username}</h6>
                  <small className="text-muted">
                    {new Date(post.created_at).toLocaleString()}
                  </small>
                </div>
              </div>
              <Card.Text>{post.content}</Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card>
          <Card.Body className="text-center">
            <p>No posts yet. Be the first to post!</p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Feed;