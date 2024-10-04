import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form, Container } from 'react-bootstrap';
import Bar from '../Components/Bar';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewScore = () => {
  const [employees, setEmployees] = useState([]); // Store employee data
  const [evaluations, setEvaluations] = useState([]); // Store evaluation data for each employee
  const token = localStorage.getItem('token');
  const { id } = useParams(); // Get training ID from URL params
  const trainId = parseInt(id, 10); // Parse the ID to integer

  // Fetch employee and evaluation data from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getEmployees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    const fetchEvaluations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getScore/${trainId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const evalData = response.data.map(employee => ({
          E_id: employee.E_id,
          score: employee.score || '',        // Default to empty if no score
          punctuality: employee.punctuality || '',  // Default to empty if no value
          discipline: employee.discipline || '',   // Default to empty if no value
          standards: employee.standards || '',     // Default to empty if no value
          remarks: employee.remarks || '',         // Default to empty if no value
          T_id: employee.T_id
        }));
        setEvaluations(evalData);
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
      }
    };

    fetchEmployees();
    fetchEvaluations();
  }, [token, trainId]);

  // Handle input change for evaluation fields
  const handleInputChange = (e, employeeId, field) => {
    const updatedEvaluations = evaluations.map(evaluation => {
      if (evaluation.E_id === employeeId) {
        return {
          ...evaluation,
          [field]: e.target.value
        };
      }
      return evaluation;
    });
    setEvaluations(updatedEvaluations);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Make API call to save evaluations
    axios.post('http://localhost:5000/addScore', { evaluations }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        toast.success('Evaluations submitted successfully!');
        console.log(evaluations)
      })
      .catch(error => {
        console.error('Error submitting evaluations:', error);
        toast.error('Error submitting evaluations!');
      });
  };

  return (
    <div>
      <Bar />
      <ToastContainer />
      <h2 id='head' className="text-center">Employee Evaluations</h2>
      <Container>
        <div className="score-table-container">
          <form onSubmit={handleSubmit}>
            <Table striped bordered hover responsive className="table-sm">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Employee Name</th>
                  <th>Hackerrank Score (10)</th>
                  <th>Punctuality (10)</th>
                  <th>Discipline (10)</th>
                  <th>Standards Followed (10)</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee, index) => {
                    // Find if the employee already has an evaluation
                    const evaluation = evaluations.filter(evaluation => evaluation.E_id === employee.id) || {
                      E_id: employee.id,
                      score: '',
                      punctuality: '',
                      discipline: '',
                      standards: '',
                      remarks: ''
                    };

                    return (
                      <tr key={employee.id}>
                        <td>{index + 1}</td>
                        <td>{employee.name}</td>
                        <td>
                          <Form.Control
                            type="number"
                            max="10"
                            min="0"
                            value={evaluation.score}
                            onChange={(e) => handleInputChange(e, employee.id, 'score')}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            max="10"
                            min="0"
                            value={evaluation.punctuality}
                            onChange={(e) => handleInputChange(e, employee.id, 'punctuality')}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            max="10"
                            min="0"
                            value={evaluation.discipline}
                            onChange={(e) => handleInputChange(e, employee.id, 'discipline')}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            max="10"
                            min="0"
                            value={evaluation.standards}
                            onChange={(e) => handleInputChange(e, employee.id, 'standards')}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={evaluation.remarks}
                            onChange={(e) => handleInputChange(e, employee.id, 'remarks')}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No employees found</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between mt-4">
              <Button type="submit" variant="primary">Submit Evaluations</Button>
              <Link to={`/allTraining`} className="btn btn-secondary">Back</Link>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default ViewScore;
