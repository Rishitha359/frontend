import axios from 'axios';
import React, { useState } from 'react'
import { toast,ToastContainer } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import {format} from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Bar from '../Components/Bar';

const AddTrainings = () => {

    const [name, setName] = useState('');
    const [start_date, setStart_Date] = useState('');
    const [end_date, setEnd_Date] = useState('');
    const [id, setId] = useState('');
    const [domain, setDomain] = useState('')
    const nav = useNavigate();

    const token = localStorage.getItem('token');
    
    const handleAddTraining = async() => {
        if(name === ""){
            toast.error("Enter name of the Training");
        }else if(id === ""){
            toast.error("Enter id of the Training");
        }else if(start_date === ""){
            toast.error("Enter start date of the Training");
        }else if(end_date === ""){
            toast.error("Enter end date of the Training");
        }else if(domain === ""){
          toast.error("Enter Domain of the Training");
        }else{
        try{
        const data = await axios.post('http://localhost:5000/addTraining',
            {
                name : name,
                start_date : format(new Date(start_date), "yyyy-MM-dd"),
                id : parseInt(id),
                end_date : format(new Date(end_date), "yyyy-MM-dd"),
                domain : domain
            },{
                headers: { Authorization: `Bearer ${token}` }})
        console.log(data);
        if(data.status === 200){
            toast.success("Successfully added Training");
            nav('/home');
        }
        }catch(error){
            toast.error("Error Adding new Training Try Logging in again");
            console.log(error)
        }}
    }

  return (
    <div>
        <Bar/>
      <>
          <h2 className='header'>Add New Training</h2>
          <div className='center-container'>
            <Card style={{'width' : '500px', 'border':'none'}}>
              <Form style={{'marginTop':'20px', 'marginBottom':'20px'}}>
                  <Form.Group>
                      <Form.Label>Name of the Training</Form.Label>
                      <Form.Control type='text' placeholder='Enter Name of the Training' onChange={(e) => setName(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Id of the Training</Form.Label>
                      <Form.Control type='number' placeholder='Enter id of the Training' onChange={(e) => setId(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Start Date of the Event</Form.Label>
                      <Form.Control type='date' placeholder='Enter Start Date of the Training' onChange={(e) => setStart_Date(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>End Date of the Training</Form.Label>
                      <Form.Control type='date' placeholder='Enter End Date of the Training' onChange={(e) => setEnd_Date(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                      <Form.Label>Domain of the Training</Form.Label>
                      <Form.Control type='text' placeholder='Enter Domain of the Training' onChange={(e) => setDomain(e.target.value)}></Form.Control>
                  </Form.Group>
                  <Button style={{'marginTop':'20px'}}className='mb-30' variant='success' onClick={handleAddTraining}>Add</Button>
              </Form>
              </Card>
              <ToastContainer/>
          </div>
        </>
    </div>
  )
}

export default AddTrainings
