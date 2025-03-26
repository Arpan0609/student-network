import React from 'react';
import axios from 'axios'; // Don't forget to import axios
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link,} from 'react-router-dom';

const CustomNavbar = ({ loggedIn, setLoggedIn }) => {
  const handleLogout = async () => {
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/logout/', 
        {},
        { 
          withCredentials: true,
          headers: {
            'X-CSRFToken': getCSRFToken() // Add this function
          }
        }
      );
      // Clear all auth-related state
      setLoggedIn(false);
      localStorage.clear();
      // Force refresh to clear all memory state
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err.response?.data);
    }
  };
  
  // Add this helper function
  const getCSRFToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Student Network</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedIn ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/messages">Messages</Nav.Link>
                {/* Logout Button */}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;