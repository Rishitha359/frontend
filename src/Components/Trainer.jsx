import { toast,ToastContainer } from 'react-toastify';
import { Button, Card, Form } from 'react-bootstrap';
import React, { useState, useEffect} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));

  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <Form.Control
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );


const Trainer = () => {

    const [user, setUser] = useState({});

    useEffect(()=> {
      const userDetails = async() => {
        try {
          const details = await axios.get('http://localhost:5000/trainings');
          setUser(details.data);
        } catch (error) {
          console.log(error);
        }
      }
      userDetails();
    },[]);

  return (
    <div>
        <div className='center-container'>
      <Card style={{'width' : '500px', 'border':'none'}}>
              <Form >
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                Select the Employee name
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}>
                {user.map((item, index)=>(
                <Dropdown.Item eventKey="index">{item.name}</Dropdown.Item>
                ))}
                </Dropdown.Menu>
            </Dropdown>
                  <Form.Group>
                      <Form.Label>Name of the Event</Form.Label>
                      <Form.Control type='text' placeholder='Enter Name of the Event' ></Form.Control>
                  </Form.Group>
                  <Button className='mb-30' variant='success' >Add</Button>
              </Form>
              </Card>
              <ToastContainer/>
    </div></div>
  )
}

export default Trainer
