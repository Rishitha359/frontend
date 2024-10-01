import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import Bar from './Bar';
import { Link } from 'react-router-dom';
import '../App.css'

const Employee = () => {
    const [trainings, setTrainings] = useState('');
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('token');

    const getDay = (dateStr) => {
        return format(new Date(dateStr), 'eeee');
    };

    const searchTrainings = (e) => {
        const s = e.target.value;
        setSearch(s);
    }

    useEffect(() => {
        const getDetails = async () => {
            try {
                const details = await axios.get('http://localhost:5000/trainingDetails',
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setTrainings(details.data);
            } catch (error) {
                console.log(error);
            }
        };
        getDetails();
    }, []);
  return (
    <div>
      <h2 style={{marginLeft:'30px', marginTop:'20px', justifyContent:'center', display:'flex'}}>List of Trainings</h2>
            <input type='text' placeholder='Search Trainings by name' onChange={searchTrainings} style={{marginLeft:'70px',width:'50%', marginBottom: '20px'}}></input> 
                <div className='d-flex' style={{ flexWrap: 'wrap' }}>
                    {trainings.filter(training =>{ return search.toLowerCase() === ''? training: training.name.toLowerCase().includes(search)}).map(training => (
                        <Card key={training.id} style={{ width: "500px", fontWeight: 'bold', marginLeft:'30px', marginBottom:'20px' }}>
                            <Card.Body>
                                <Card.Text>Name : {training.name}</Card.Text>
                                <Card.Text>Start Date & Day : {format(new Date(training.start_date), 'dd MMM yyyy')} {getDay(training.start_date)}</Card.Text>
                                <Card.Text>End Date & Day : {format(new Date(training.end_date), 'dd MMM yyyy')} {getDay(training.end_date)}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
    </div>
  )
}

export default Employee
