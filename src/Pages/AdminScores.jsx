import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Form } from 'react-bootstrap';
import Bar from '../Components/Bar';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminScores = () => {
  const [evaluations, setEvaluations] = useState([]); // Store evaluation data
  const [employees, setEmployees] = useState([]); // Store employee data for filtering
  const [trainings, setTrainings] = useState([]); // Store training data for filtering
  const [selectedEmployee, setSelectedEmployee] = useState(''); // Store selected employee
  const [selectedTraining, setSelectedTraining] = useState(''); // Store selected training
  const token = localStorage.getItem('token');

  // Fetch evaluation data from the backend
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getScore`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
        toast.error('Failed to fetch evaluation data.');
      }
    };

    // Fetch employees for filtering
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getEmployees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Failed to fetch employee data.');
      }
    };

    // Fetch trainings for filtering
    const fetchTrainings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/trainingDetails`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrainings(response.data);
      } catch (error) {
        console.error('Error fetching training data:', error);
        toast.error('Failed to fetch training data.');
      }
    };

    fetchEvaluations();
    fetchEmployees();
    fetchTrainings();
  }, [token]);

  // Filter evaluations based on selected employee or training
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesEmployee = selectedEmployee ? evaluation.employee.id === parseInt(selectedEmployee) : true;
    const matchesTraining = selectedTraining ? evaluation.training.id === parseInt(selectedTraining) : true;
    return matchesEmployee && matchesTraining;
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
      <Bar />
      <ToastContainer />
      <h2 id='head' className="text-center" style={{ marginBottom: '20px', color: '#343a40' }}>Training Evaluations</h2>
      <Container>
        {/* Filter Section */}
        <div className="filter-container mb-3" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Form.Select 
            onChange={(e) => setSelectedEmployee(e.target.value)} 
            defaultValue="" 
            style={{ flex: 1, marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </Form.Select>

          <Form.Select 
            onChange={(e) => setSelectedTraining(e.target.value)} 
            defaultValue="" 
            style={{ flex: 1, marginLeft: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
          >
            <option value="">Select Training</option>
            {trainings.map((training) => (
              <option key={training.id} value={training.id}>
                {training.name}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Score Table */}
        <div className="score-table-container">
          <Table striped bordered hover responsive className="table-sm" style={{ backgroundColor: '#ffffff' }}>
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Training Name</th>
                <th>Hackerrank Score (10)</th>
                <th>Punctuality (10)</th>
                <th>Discipline (10)</th>
                <th>Standards Followed (10)</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((evaluation, index) => (
                  <tr key={evaluation.E_id}>
                    <td>{index + 1}</td>
                    <td>{evaluation.employee.name}</td>
                    <td>{evaluation.training.name}</td>
                    <td>{evaluation.score}</td>
                    <td>{evaluation.punctuality}</td>
                    <td>{evaluation.discipline}</td>
                    <td>{evaluation.standards}</td>
                    <td>{evaluation.remarks}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No evaluations found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Back Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button style={{ backgroundColor: '#007bff', border: 'none', color: '#fff', padding: '10px 20px' }}>
            <Link id='lin' to={`/allTraining`} style={{ color: '#fff', textDecoration: 'none' }}>Back</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default AdminScores;
