import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';

const Bar = () => {
  const [user, setUser] = useState({});
  const email = localStorage.getItem('email');

  const handleLogout = () =>{
    localStorage.removeItem('token')
  }
  useEffect(()=> {
    const userDetails = async() => {
      try {
        const details = await axios.post('http://localhost:5000/emp',{email: email});
        setUser(details.data);
      } catch (error) {
        console.log(error);
      }
    }
    userDetails();
  },[]);

  return (
    <div>
      <Navbar style={{backgroundColor:"#7754f7", height: "80px", fontWeight:'bold'}} data-bs-theme="dark">
        <Container>
          <Navbar.Brand>
          Welcome {user.name} </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/" onClick={handleLogout}>Sign Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  )
}

export default Bar
