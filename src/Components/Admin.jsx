import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import Select from 'react-select';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const Admin = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const token = localStorage.getItem('token');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getScore', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    const getDetails = async () => {
      try {
        const details = await axios.get('http://localhost:5000/getEmployees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(details.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDetails();
    fetchMetrics();
  }, [token]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const employeeOptions = [...new Set(user.map((metric) => ({
    value: metric.id,
    label: metric.name,
  })))];

  const filteredMetrics = selectedEmployee
    ? metrics.filter((metric) => metric.employee.id === selectedEmployee.value)
    : metrics;

  const groupByTraining = filteredMetrics.reduce((result, metric) => {
    const trainingName = metric.training.name;
    if (!result[trainingName]) {
      result[trainingName] = [];
    }
    result[trainingName].push(metric);
    return result;
  }, {});

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center mb-4">Employee Performance Dashboard</h2>

          {/* Employee Selection Dropdown */}
          <Card className="p-3 mb-4 shadow-sm">
            <Select
              options={employeeOptions}
              placeholder="Select an employee"
              isClearable
              onChange={setSelectedEmployee}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#ced4da',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#7754f7',
                  },
                }),
              }}
            />
          </Card>

          {/* Display the charts for filtered metrics */}
          {Object.keys(groupByTraining).length === 0 ? (
            <p className="text-center">No data available for the selected employee.</p>
          ) : (
            Object.keys(groupByTraining).map((training) => {
              const metricsForTraining = groupByTraining[training];

              const employeeNames = metricsForTraining.map((m) => m.employee.name);
              const scores = metricsForTraining.map((m) => m.score || 0);
              const punctuality = metricsForTraining.map((m) => m.punctuality || 0);
              const discipline = metricsForTraining.map((m) => m.discipline || 0);
              const standards = metricsForTraining.map((m) => m.standards || 0);

              return (
                <Card key={training} className="mb-4 shadow-sm">
                  <Card.Body>
                    <h5 className="card-title text-center">{training} Metrics</h5>

                    {/* Grouped Bar Chart for all metrics of this training */}
                    <ApexCharts
                      options={{
                        chart: {
                          type: 'bar',
                          stacked: false,
                        },
                        title: { text: `${training} Performance Metrics` },
                        xaxis: {
                          categories: employeeNames,
                        },
                        yaxis: {
                          title: { text: 'Scores' },
                        },
                        plotOptions: {
                          bar: {
                            horizontal: false,
                            dataLabels: {
                              position: 'top',
                            },
                            columnWidth: '45%',
                          },
                        },
                        dataLabels: {
                          enabled: true,
                          offsetY: -20,
                          style: {
                            fontSize: '12px',
                            colors: ['#304758'],
                          },
                        },
                        legend: {
                          position: 'top',
                          horizontalAlign: 'right',
                        },
                      }}
                      series={[
                        { name: 'Hackerrank Score', data: scores },
                        { name: 'Punctuality', data: punctuality },
                        { name: 'Discipline', data: discipline },
                        { name: 'Standards Followed', data: standards },
                      ]}
                      type="bar"
                      height={400}
                    />
                  </Card.Body>
                </Card>
              );
            })
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
