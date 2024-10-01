import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import Bar from './Bar';
import { Link } from 'react-router-dom';
import '../App.css'

const TrainingDetails = () => {
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('token');

    const handleClose = () => {
        setShow(false);
        selectedTraining(null);
    };
    
    const handleShow = (event) => {
        setSelectedTraining(event);
        setShow(true);
    };

    const getDay = (dateStr) => {
        return format(new Date(dateStr), 'eeee');
    };

    useEffect(() => {
        const getDetails = async () => {
            try {
                const details = await axios.get('http://localhost:5000/trainings',
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

    const handleUpdateTraining = async (e) => {
        e.preventDefault();
        if (!selectedTraining) return;

        const updatedTraining = {
            name: e.target.name.value,
            start_date: new Date(e.target.start_date.value).toISOString(),
            end_date: new Date(e.target.end_date.value).toISOString(),
        };

        try {
            await axios.post(`http://localhost:5000/updateTraining/${selectedTraining.id}`, updatedTraining,
              {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainings(trainings.map(training => training.id === selectedTraining.id ? updatedTraining : training));
            toast.success('Training details updated successfully');
            handleClose();
        } catch (error) {
            console.error('Failed to update Training', error);
            toast.error('Failed to update Training');
        }
    };

    const handleDeleteTraining = async (trainId) => {
        try {
            await axios.delete(`http://localhost:5000/deleteTraining/${trainId}`,
              {
                headers: { 
                  Authorization: `Bearer ${token}` 
                }

            });
            setTrainings(trainings.filter(training => training.id !== trainId));
            toast.success('Training deleted successfully');
        } catch (error) {
            console.error('Failed to delete Training', error);
            toast.error('Failed to delete Training');
        }
    };

    const searchTrainings = (e) => {
        const s = e.target.value;
        setSearch(s);
    }

    return (
        <div>
            <Bar />
            <h2 style={{marginLeft:'30px', marginTop:'20px', justifyContent:'center', display:'flex'}}>List of Trainings</h2>
            <input type='text' placeholder='Search Trainings by name' onChange={searchTrainings} style={{marginLeft:'70px',width:'50%', marginBottom: '20px'}}></input> 
            <ul>
                <div className='d-flex' style={{ flexWrap: 'wrap' }}>
                    {trainings.filter(training =>{ return search.toLowerCase() === ''? training: training.name.toLowerCase().includes(search)}).map(training => (
                        <Card key={training.id} style={{ width: "500px", fontWeight: 'bold', marginLeft:'30px', marginBottom:'20px' }}>
                            <Card.Body>
                                <Card.Text>Name : {training.name}</Card.Text>
                                <Card.Text>Start Date & Day : {format(new Date(training.start_date), 'dd MMM yyyy')} {getDay(training.start_date)}</Card.Text>
                                <Card.Text>End Date & Day : {format(new Date(training.end_date), 'dd MMM yyyy')} {getDay(training.end_date)}</Card.Text>
                                <Button variant='primary'><Link id='lin' to = {`/userEventDetails/${training.id}`}>View Scores</Link> </Button>{' '}
                                <Button variant='success' onClick={() => handleShow(training)}>Edit Training Details</Button>{' '}
                                <Button variant='danger' onClick={() => handleDeleteTraining(training.id)}>Delete Training</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Training Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedTraining && (
                            <Form onSubmit={handleUpdateTraining}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        defaultValue={selectedTraining.name}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        defaultValue={format(new Date(selectedTraining.start_date), 'yyyy-MM-dd')}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        defaultValue={format(new Date(selectedTraining.end_date), 'yyyy-MM-dd')}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>
            </ul>
            <ToastContainer />
        </div>
    );
}

export default TrainingDetails;
