import './App.css';
import axios from 'axios';
import config from './config';
import { Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState, useRef, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function Validate() {


    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [confirm, setConfirm] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState(null);
    const [reason, setReason] = useState(null);
    const reasons = [
        {reason:'key already issued in window',description:'U-Vote will issue you a key every quarter. Our records show that you have received a key in this quarter. Locate your latest text message from U-Vote with the key to access your votes',showButton:false},
        {reason:'not a match',description:'the information you entered does not match your voter record.', showButton:true},
        {reason:'unknown error',description:'An unknown error occured when attempting to validate you.', showButton:true}

    ];

        // const [registered, setRegistered] = useState(false);//to represent that the voter has not registered
    //const navigate = useNavigate();
    // for captcha
    const recaptchaRef = useRef(null);

    const validate = async ()=>{

        const form = document.getElementById('validateForm');


        if(form.checkValidity()){

            try{
                let inputs = form.querySelectorAll('input');
            inputs.forEach((input)=>{
                if(input.classList.contains('error')){
                    input.classList.remove('error');
                }
            });

            if(form.classList.contains('error')){
                form.classList.remove('error');
            }
            let idsampleVal = document.getElementById('idsample').value;
            let phoneVal = document.getElementById('phone').value;

            let payload = {
                phone:phoneVal,
                idsample:idsampleVal
            }
            setLoading(true);
            let res = await axios.post(`${config.apiBaseUrl}/validate`,payload);
            if (res.status === 200 && res.data) {
                setConfirm(true);
                setConfirmStatus('success');
            } else {
                setConfirm(true);
                setConfirmStatus('error');
                setReason(reasons[res.data.reason]);
            }

                setLoading(false);
            }catch(err){
                setLoading(false);
                setConfirm(true);
                setConfirmStatus('error');
                if(err && err.response && err.response.data){
                    setReason(reasons[err.response.data.reason]);
                }
                
            }
        }else{
            let idsampleVal = document.getElementById('idsample')
            let phoneVal = document.getElementById('phone')
            
            if(idsampleVal.checkValidity() === false){
                idsampleVal.classList.add('error')
            }

            if(phoneVal.checkValidity() === false){
                phoneVal.classList.add('error')
            }
            
        }
    }



     // check captcha val
  const checkCaptcha = async () => {
    const captchaToken = recaptchaRef.current.getValue();
    //recaptchaRef.current.reset();// reset the captcha

    var payload = {};
    payload['token'] = captchaToken;
    try{
      let response = await axios.post(`${config.apiBaseUrl}/register/check-bot`, payload);//await axios.post("https://vote.u-vote.us/register", formData);

      if (response.status === 200 && response.data.regToken) {
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
    <h2 className='mt-1'>Validate to recieve your voter key</h2>
    <Row className='pt-1 pb-2 validate-instructions'>
        <div>Validate each quarter to receive a new voter key.</div> 
        <div>If you're new to U-Vote, get started by <a href="/getkey">registering</a> for a voter key.</div>
        <div>If you have already received your voter key this quarter, use the link from your latest message from U-Vote.</div>
    </Row>
   
  {loading ? (<Spinner></Spinner>) : (<>
    {confirm && confirm === true ? (<Row id="confirmation" className="confirm">
    <h2 id="confirmMessage">Status: {confirmStatus === 'success' ? 'Confirmed' : 'Error'}</h2>
    {confirmStatus === 'success' ? (<p id="confirmText">You have been validated. If you were conditionally approved, you are now approved. If you have not received your voter key, you should receive a text message with your voter key very soon. 
    </p>) : (
    <Row> 
        <Row>
            <p>Reason: {reason.reason}</p>
            <p id="confirmText">{reason.description}
            </p>
            {reason.showButton ? (<Col lg={{span:10,offset:2}}>
               
               <Button variant='primary' type="button" class="btn btn-primary" onClick={()=>{
                   setConfirm(false);
                   setConfirmStatus(null);
                   setDisabled(true);
               }} >Try again</Button>
               </Col>) : (<></>) }
            
        </Row>
    </Row>
    )}
    <Col sm={12} className='confirm-img'></Col>
</Row>):(<>
<Form id="validateForm">
    <Row>
    <Col sm={12} lg={10}>
        <Form.Label for="idsample">Last 4 of ID:</Form.Label>
        <Form.Control type="text" pattern="[A-Z0-9]{4,4}" maxlength="4" class="form-control" id="idsample" name="idsample"  aria-describedby="emailHelp" required /> 
        <Form.Text id="idsampleHelp" class="form-text">This is the last <strong>4 characters</strong> of the ID you used during registration</Form.Text>
    </Col>
    </Row>
    <Row>
    <Col sm={12} lg={10}>
        <Form.Label for="phone" >Phone:</Form.Label>
        <Form.Control type="text" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" minlength="10" maxlength="10" id="phone" name="phone" autocomplete="tel" required />
        <Form.Text id="phonesampleHelp" >The <strong>10 digit</strong> phone number you used during registration</Form.Text>
    </Col>
    </Row>

<Row className='mb-4 mt-4' >
              <ReCAPTCHA ref={recaptchaRef} sitekey={"6Le-QPIoAAAAAJT5-G3P009gn52wZR3TLLSBB3Fj"} onChange={() => checkCaptcha()} />
            </Row>
    <Row>
    <Col lg={{span:10,offset:2}} >
    <Button variant='primary' id="validateBtn" type="button" class="btn btn-primary" onClick={() => validate()} disabled={disabled}>Submit</Button>
    </Col>
    
    </Row>
</Form>


</>)}
  </>)}</Container>)
}

export default Validate;