import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';
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

  return (
    <div>
      <Bar />
      <ToastContainer />
      <h2 id='head' className="text-center">Employee Evaluations</h2>
      <Container>
        <div className="score-table-container">
          <Table striped bordered hover responsive>
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
                  const evaluation = evaluations.find(evaluation => evaluation.E_id === employee.id) || {
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
                      <td>{evaluation.score}</td> {/* Display score as plain text */}
                      <td>{evaluation.punctuality}</td> {/* Display punctuality as plain text */}
                      <td>{evaluation.discipline}</td> {/* Display discipline as plain text */}
                      <td>{evaluation.standards}</td> {/* Display standards as plain text */}
                      <td>{evaluation.remarks}</td> {/* Display remarks as plain text */}
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
            <Link to={`/allTraining`} className="btn btn-secondary">Back</Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ViewScore;
