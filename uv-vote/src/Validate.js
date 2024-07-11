import './App.css';
import axios from 'axios';
import config from './config';
import { Alert, Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function Validate() {


    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);


        // const [registered, setRegistered] = useState(false);//to represent that the voter has not registered
    const navigate = useNavigate();
    // for captcha
    const recaptchaRef = useRef(null);


     // check captcha val
  const checkCaptcha = async () => {
    const captchaToken = recaptchaRef.current.getValue();
    //recaptchaRef.current.reset();// reset the captcha

    var payload = {};
    payload['token'] = captchaToken;
    try{
      let response = await axios.post(`${config.apiBaseUrl}/register/check-bot`, payload);//await axios.post("https://vote.u-vote.us/register", formData);

      if (response.status === 200 && response.data) {
        // setRegisterToken(response.data.regToken); 
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }catch(err){
      setDisabled(true);
    }
   

  }

  return(<Container fluid="md">
    <hr></hr>
    <h2>Validate to recieve your voter key</h2>
  {loading ? (<Spinner></Spinner>) : (
<>
<Form id="validateForm">
    <Row>
    <Col sm={12} lg={10}>
        <Form.Label for="idsample">Last 4 of ID:</Form.Label>
        <Form.Control type="text" pattern="[A-Z0-9]{4,4}" maxlength="4" class="form-control" id="idsample" name="idsample"  aria-describedby="emailHelp" required /> 
        <Form.Text id="idsampleHelp" class="form-text">This is the last <strong>4 characters</strong> the ID you used during registration</Form.Text>
    </Col>
    </Row>
    <Row>
    <Col sm={12} lg={10}>
        <Form.Label for="phone" >Phone:</Form.Label>
        <Form.Control type="text" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" minlength="10" maxlength="10" id="phone" name="phone" autocomplete="tel" required />
        <Form.Text id="phonesampleHelp" >The <strong>10 digit</strong> phone number you used during registration</Form.Text>
    </Col>
    </Row>
    <Row>
    <Col lg={{span:10,offset:2}} >
    <Button variant='primary' id="validateBtn" type="button" class="btn btn-primary" disabled>Submit</Button>
    </Col>
    
    </Row>
</Form>
<Row id="confirmation" className="confirm">
    <h2 id="confirmMessage">Success</h2>
    <p id="confirmText">You have been validated. If you were conditionally approved, you are now approved. If you have not received your voter key, you should receive a text message with your voter key very soon. 
    </p>
    <Col sm={12} className='confirm-img'></Col>
</Row>
<Row className='mb-4 mt-4' >
              <ReCAPTCHA ref={recaptchaRef} sitekey={"6Le-QPIoAAAAAJT5-G3P009gn52wZR3TLLSBB3Fj"} onChange={() => checkCaptcha()} />
            </Row>

</>

  )}</Container>)
}

export default Validate;