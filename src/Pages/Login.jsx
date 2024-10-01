import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import '../App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import image from '../Assets/login.jpg';

const Login = () => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const nav = useNavigate();

    const handleLogin = async() => {
        if(email===''){
            toast.error("Email can't be empty");
        }else if(password===''){
            toast.error("Password can't be empty");
        }else{
        try {
            const response = await axios.post('http://localhost:5000/emp',{
                email : email,
                password : password
            })
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);

            if(response.status === 200){
                toast.success("Login Successful")
                nav('/home');
                window.location.reload();
            }else
                toast.error("Some error");
        } catch (error) {
            toast.error("Invalid Credentials ");
        }}

    }
  return (
    <>
          <div className='container'>
          <div className="section left">
          <h2 id='head'>Login Page</h2>
          <div className='center-container'>
              <Form >
                  <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type='email' placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type='password' placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}></Form.Control>
                  </Form.Group><Button className='mb-30' variant='success' onClick={handleLogin} style={{marginTop:'10px'}}>Login</Button>
              </Form>
              </div></div>
              <div className='section right'>
                  <div className="flex-container">
                    <img src={image} alt="Centered" className="centered-image" />
                  </div>
              </div>
          </div>
          <ToastContainer/>
        </>
  )
}

export default Login
