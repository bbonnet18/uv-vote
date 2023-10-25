import './App.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import config from './config';
import {Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState } from 'react';


function Verify() {


  const [loading, setLoading] = useState(false);
  // check fields and attempt to add
  const verify = async () => {

    const form = document.getElementById('validateForm');
    const isValid = form.checkValidity();
    if (isValid) {
      form.classList.remove('invalid');

      var idsample = form.querySelector("#idsample");
      var phone = form.querySelector('#phone');
    
      var payload = {
        'idsample':idsample.value.trim(),
        'phone':phone.value.trim()
      }
      setLoading(true)
      try{
        
        let res = await axios.post(`${config.apiBaseUrl}/validate`, payload);//await axios.post("https://vote.u-vote.us/register", formData);
        form.reset();
        console.log(res);
        setLoading(false)
      }catch(err){
        let errorsDiv = document.getElementById('errors');
        errorsDiv.innerText = err;
        setLoading(false)
      }
     
    } else {
      form.classList.add('invalid');
      console.log('not valid')
    }

  }
  return (
    <Container>
        {loading ? (<Spinner></Spinner>):(
          <>
             <nav>
                <NavLink to="/">Home </NavLink> | 
                <NavLink to="/getkey">Get a voter key</NavLink>
            </nav>
              <h2>Complete your validation</h2>
              
    <hr></hr>
           
             <Form id="validateForm">
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aIDsample" as={Col} lg={2}>Last 4 characters of your ID</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control id="idsample" name="idsample" lg={6} type="text" placeholder="last 4 of ID" defaultValue={''} required />
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aPhone" as={Col} lg={2}>Phone</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Control id="phone" name="phone" type="tel" placeholder="phone" defaultValue={''} required />
                    </Col>
               </Row>
               
               <Button variant='primary' onClick={() => verify()}>Submit</Button>
             </Form>
          </>
           
        )}
     <div id="errors">Errors Div</div>
    </Container>
  );
}

export default Verify;
