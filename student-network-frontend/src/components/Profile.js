import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Form, Row, Col, Image, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: 'john_doe',
    bio: 'Computer Science Student | Web Developer',
    skills: 'React, Django, Python',
    interests: 'AI, Machine Learning, Hiking',
    connections: 42,
    posts: 15
  });
  const [editing, setEditing] = useState(false);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            <Col md={3} className="text-center">
              <Image 
                src="https://via.placeholder.com/150" 
                roundedCircle 
                className="mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h4>{profile.username}</h4>
              <p className="text-muted">{profile.connections} connections</p>
            </Col>
            <Col md={9}>
              <Tabs defaultActiveKey="about" className="mb-3">
                <Tab eventKey="about" title="About">
                  {editing ? (
                    <Form className="mt-3">
                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        />
                      </Form.Group>
                      <Button variant="primary" onClick={() => setEditing(false)}>
                        Save
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <p className="mt-3">{profile.bio}</p>
                      <h5>Skills</h5>
                      <p>{profile.skills}</p>
                      <h5>Interests</h5>
                      <p>{profile.interests}</p>
                      <Button variant="secondary" onClick={() => setEditing(true)}>
                        Edit Profile
                      </Button>
                    </>
                  )}
                </Tab>
                <Tab eventKey="activity" title="Activity">
                  <div className="mt-3">
                    <h5>Recent Posts</h5>
                    <p>You have {profile.posts} posts</p>
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;