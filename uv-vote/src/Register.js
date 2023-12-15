import './App.css';
import axios from 'axios';
import config from './config';
import { Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function Register() {

  const starterVoter = {
    "lastname": "",
    "firstname": "",
    "city": "",
    "state": "",
    "phone": ""
  }
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [currentVoter, setCurrentVoter] = useState(starterVoter);
  // const [registered, setRegistered] = useState(false);//to represent that the voter has not registered
  const navigate = useNavigate();
  // for captcha
  const recaptchaRef = useRef(null);

  // check captcha val
  const checkCaptcha = async ()=>{
    const captchaToken = recaptchaRef.current.getValue();
    //recaptchaRef.current.reset();// reset the captcha
    
    var payload = {};
    payload['token'] = captchaToken;

    let response = await axios.post(`${config.apiBaseUrl}/register/check-bot`,payload);//await axios.post("https://vote.u-vote.us/register", formData);

    if(response.status === 200){
      setDisabled(false);
    }else{
      setDisabled(true);
    }

  }



  // check fields and attempt to add
  const register = async () => {

    console.log('currentVoter :', currentVoter);
    const form = document.getElementById('registerForm');
    const isValid = form.checkValidity();
    const phone = form.querySelector('#phone');

    if(phone){
      const isvalid = phone.checkValidity();
      console.log('phone valid: ', isvalid)
    }
    if (isValid) {
      form.classList.remove('invalid');
      var formFields = form.querySelectorAll('.form-control');
      var genderSelect = form.querySelector('#gender');
      var stateSelect = form.querySelector('#state');
      var idFile = form.querySelector("#idFile")
      var selfyFile = form.querySelector("#selfyFile")

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
      formData.append('selfyFile',selfyFile.files[0]);

      try{
        setLoading(true)
        let res = await axios.post(`${config.apiBaseUrl}/register`, formData);//await axios.post("https://vote.u-vote.us/register", formData);
        form.reset();
        if(res.status === 200){
          navigate('/confirm')
        }else{
          alert('unable to register, please try live validation');
        }
        setLoading(false)
      }catch(err){
        alert('unable to register, please try live validation');
      }
     
    } else {
      form.classList.add('invalid');
      console.log('not valid')
    }

  }
  return (
    <Container fluid="md">
        {loading ? (<Spinner></Spinner>):(
          <>
              <h2>Register for a U-Vote Key <a href="#keyInfo"><img src="info-circle.svg" className='key-info-img' alt="info about keys"></img></a></h2>
              
    <hr></hr>
           
             <Form id="registerForm">
               <Row className='mb-2'>
                    <Col lg={2} md={12}>
                        <Form.Label id="aFirst" as={Col} lg={2}>First</Form.Label>
                    </Col>
                    <Col lg={10} md={12}>
                        <Form.Control id="firstName" name="firstname" lg={6} type="text" placeholder="first name" defaultValue={currentVoter.firstname} required />
                    </Col>
               </Row>
               <Row id="firstError" className="error-txt">
                  
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
                        <Form.Control id="city" name="city" lg={6} type="text" minLength={2} placeholder="city" defaultValue={currentVoter.city} required />
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aState" as={Col} lg={2}>State</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Select aria-label="State" name="state" id="state" required defaultValue="AL" >
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
                    <Form.Control className='' id="phone" name="phone" maxLength={10} minLength={10} type="tel" pattern="[0-9]{10}" placeholder="phone" defaultValue={currentVoter.phone} required />
                    <Form.Text id="phoneHelp" muted>
                          Enter a 10 digit phone number starting with the area code
                    </Form.Text>
                    </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aAge" as={Col} lg={2}>Age</Form.Label>
                    </Col>
                    <Col lg={10}>
                        <Form.Control id="age" name="age" size="lg" type="number" min={18} placeholder="age" defaultValue={currentVoter.age} required />
                    </Col>
                    <Form.Text id="phoneHelp" muted>
                          You must be 18 or older
                    </Form.Text>
               </Row>
                <Row className='mb-2'>
                  <Col lg={2}>
                    <Form.Label id="aText" as={Col} lg={2}>Agree to text messages</Form.Label>
                  </Col>
                  <Col lg={10}>
                  <Form.Check // prettier-ignore
                   type={'checkbox'}
                   id={'opt-in'}
                   label={'I agree to receive text messages from U-Vote'} required
                 />
                  </Col>
                   <Form.Text id="phoneHelp" muted>
                      Agreement is required for U-Vote participation
                    </Form.Text>
                </Row>
                <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aGender" as={Col} lg={2}>Gender</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Select aria-label="Gender" name="gender" id="gender" required defaultValue="F">
                   <option value="F">Female</option>
                   <option value="M">Male</option>
                   <option value="U">Note Specified</option>
                 </Form.Select>
                    </Col>
               </Row>
               <Row className="img-preview-wrapper" >
               <Col  lg={{span:4,offset:2}} className='step-one'>
                    <p><strong>Step 1:</strong> Take a picture of your ID</p>
                    </Col>
               <Col className='img-preview mt-2' lg={{span:4,offset:2}}>
                    <img id="previewImg" alt="preview image" src="" />
              </Col>
               </Row>
               <Row className='mb-2'>
                    <Col lg={2}>
                        <Form.Label id="aFile" as={Col} lg={2}>ID File:</Form.Label>
                    </Col>
                    <Col lg={10}>
                    <Form.Control type="file" id="idFile" accept='.jpeg' onChange={(evt)=>{
                        let preview = document.getElementById('previewImg');
                        console.log('received a file - ',URL.createObjectURL(evt.target.files[0]));
                        preview.src = URL.createObjectURL(evt.target.files[0]);
                        preview.onload = function() {
                          URL.revokeObjectURL(preview.src) // free memory
                        }
                        preview.classList.add('showing')
                    }}  required/>
                    </Col>
                   
               </Row>
            
               <Row className="img-preview-wrapper" >
                    <Col  lg={{span:4,offset:2}} className='step-two'> 
                    <p><strong>Step 2:</strong>Take a selfy with your ID</p>
                    </Col>
                    <Col className='img-preview selfy mt-2' lg={{span:4,offset:2}}>
                    <img id="selfyImg" alt="selfy image" src="" />
                    </Col>
               </Row>
               <Row>
               <Col lg={2}>
                        <Form.Label id="aFile" as={Col} lg={2}>Selfy File:</Form.Label>
                    </Col>
               <Col lg={10}>
                
                    <Form.Control type="file" id="selfyFile" accept='.jpeg' onChange={(evt)=>{
                        let preview = document.getElementById('selfyImg');
                        console.log('received a file - ',URL.createObjectURL(evt.target.files[0]));
                        preview.src = URL.createObjectURL(evt.target.files[0]);
                        preview.onload = function() {
                          URL.revokeObjectURL(preview.src) // free memory
                        }
                        preview.classList.add('showing')
                    }} required/>
                    </Col>
               </Row>
            
              <Row className='mb-4 mt-4' >
                  <ReCAPTCHA ref={recaptchaRef} sitekey={"6Le-QPIoAAAAAJT5-G3P009gn52wZR3TLLSBB3Fj"} onChange={()=>checkCaptcha()} />
               </Row>
              <Button variant='primary' onClick={() => register()} disabled={disabled}>Register</Button>
               
             </Form>
          </>
           
        )}

    
    </Container>
  );
}

export default Register;
