import './App.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { Accordion, Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState } from 'react';


function Register() {

  const starterVoter = {
    "lastname": "",
    "firstname": "",
    "city": "",
    "state": "",
    "phone": ""
  }
  const [loading, setLoading] = useState(false);
  const [currentVoter, setCurrentVoter] = useState(starterVoter)
  // check fields and attempt to add
  const register = async () => {

    console.log('currentVoter :', currentVoter);
    const form = document.getElementById('registerForm');
    const isValid = form.checkValidity();
    if (isValid) {
      form.classList.remove('invalid');
      var formFields = form.querySelectorAll('.form-control');
      var genderSelect = form.querySelector('#gender');
      var stateSelect = form.querySelector('#state');
      var idFile = form.querySelector("#idFile")

      var formData = new FormData();
      for (let i = 0; i < formFields.length; i++) {
        if(formFields[i].type !== "file"){
            console.log('val: ', formFields[i].value);
            formData.append(formFields[i].name,formFields[i].value);
        }
      }

      formData.append('gender',genderSelect.value);
      formData.append('state',stateSelect.value); 
      formData.append('idFile',idFile.files[0]);
      try{
        setLoading(true)
        let res = await axios.post("http://localhost:3003/register", formData);//await axios.post("https://vote.u-vote.us/register", formData);
        form.reset();
        console.log(res);
        setLoading(false)
      }catch(err){
        let errorsDiv = document.getElementById('errors');
        errorsDiv.innerText = err;
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
                <NavLink to="/">Home</NavLink>
            </nav>
              <h2>Register for a U-Vote Key <a href="#keyInfo"><img src="info-circle.svg" className='key-info-img' alt="info about keys"></img></a></h2>
              
    <hr></hr>
           
             <Form id="registerForm">
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aFirst" as={Col} lg={2}>First</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control id="firstName" name="firstname" lg={6} type="text" placeholder="first name" defaultValue={currentVoter.firstname} required />
                    </Col>
               </Row>
               <Row id="firstError" class="error-txt">
                  
               </Row>
               <Row  className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aLast">Last</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control id="lastName" name="lastname" type="text" placeholder="last name" defaultValue={currentVoter.lastname} required />
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aCity" as={Col} lg={2}>City</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control id="city" name="city" lg={6} type="text" minLength={2} placeholder="city" defaultValue={currentVoter.city} />
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aState" as={Col} lg={2}>State</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Select aria-label="State" name="state" id="state" required defaultValue="F">
                   <option value="AL">Alabama</option>
                   <option value="AK">Alaska</option>
                   <option value="AZ">Arizona</option>
                   <option value="AR">Arkansas</option>
                   <option value="CA">California</option>
                   <option value="CO">Colorado</option>
                   <option value="CT">Connecticut</option>
                   <option value="DE">Delaware</option>
                   <option value="DC">District Of Columbia</option>
                   <option value="FL">Florida</option>
                   <option value="GA">Georgia</option>
                   <option value="HI">Hawaii</option>
                   <option value="ID">Idaho</option>
                   <option value="IL">Illinois</option>
                   <option value="IN">Indiana</option>
                   <option value="IA">Iowa</option>
                   <option value="KS">Kansas</option>
                   <option value="KY">Kentucky</option>
                   <option value="LA">Louisiana</option>
                   <option value="ME">Maine</option>
                   <option value="MD">Maryland</option>
                   <option value="MA">Massachusetts</option>
                   <option value="MI">Michigan</option>
                   <option value="MN">Minnesota</option>
                   <option value="MS">Mississippi</option>
                   <option value="MO">Missouri</option>
                   <option value="MT">Montana</option>
                   <option value="NE">Nebraska</option>
                   <option value="NV">Nevada</option>
                   <option value="NH">New Hampshire</option>
                   <option value="NJ">New Jersey</option>
                   <option value="NM">New Mexico</option>
                   <option value="NY">New York</option>
                   <option value="NC">North Carolina</option>
                   <option value="ND">North Dakota</option>
                   <option value="OH">Ohio</option>
                   <option value="OK">Oklahoma</option>
                   <option value="OR">Oregon</option>
                   <option value="PA">Pennsylvania</option>
                   <option value="RI">Rhode Island</option>
                   <option value="SC">South Carolina</option>
                   <option value="SD">South Dakota</option>
                   <option value="TN">Tennessee</option>
                   <option value="TX">Texas</option>
                   <option value="UT">Utah</option>
                   <option value="VT">Vermont</option>
                   <option value="VA">Virginia</option>
                   <option value="WA">Washington</option>
                   <option value="WV">West Virginia</option>
                   <option value="WI">Wisconsin</option>
                   <option value="WY">Wyoming</option>
                 </Form.Select>
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aPhone" as={Col} lg={2}>Phone</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Control id="phone" name="phone" type="tel" placeholder="phone" defaultValue={currentVoter.phone} required />
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aAge" as={Col} lg={2}>Age</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control id="age" name="age" size="lg" type="number" placeholder="age" defaultValue={currentVoter.state} required />
                    </Col>
               </Row>
                <Row className='mb-2'>
                <Form.Check // prettier-ignore
                   type={'checkbox'}
                   id={'opt-in'}
                   label={'Agree to receive text messages'} required
                 />
                </Row>
                <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aGender" as={Col} lg={2}>Gender</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Select aria-label="Gender" name="gender" id="gender" required defaultValue="F">
                   <option value="F">Female</option>
                   <option value="M">Male</option>
                   <option value="U">Unknown</option>
                 </Form.Select>
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aFile" as={Col} lg={2}>ID File:</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Control type="file" id="idFile" onChange={(evt)=>{
                        let preview = document.getElementById('previewImg');
                        console.log('received a file - ',URL.createObjectURL(evt.target.files[0]));
                        preview.src = URL.createObjectURL(evt.target.files[0]);
                        preview.onload = function() {
                          URL.revokeObjectURL(preview.src) // free memory
                        }
                        preview.classList.add('showing')
                    }} required/>
                    </Col>
               </Row>
               <Row className='img-preview-wrapper'>
                    <img id="previewImg" alt="preview image" src="https://uv-vote-registrations.s3.amazonaws.com/13211234567.jpg?AWSAccessKeyId=AKIAQFHFDVH3JOED3SRX&Expires=1694222459&Signature=h25fetlXfVqVBJChrpQhptgLJrw%3D" className='img-preview'/>
               </Row>
               <Button variant='primary' onClick={() => register()}>Submit</Button>
             </Form>
          </>
           
        )}
     <div id="errors">Errors Div</div>
     <hr></hr>
     <Row id="keyInfo">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>What's a voter key?</Accordion.Header>
          <Accordion.Body>
            (A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key. )
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I get a key?</Accordion.Header>
          <Accordion.Body>
            (A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key. )
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I vote?</Accordion.Header>
          <Accordion.Body>
            (A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key. )
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Row>
    </Container>
  );
}

export default Register;
