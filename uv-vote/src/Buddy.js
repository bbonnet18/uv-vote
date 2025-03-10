import './App.css';
import axios from 'axios';
import config from './config';
import { Alert, Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function Buddy() {

  const starterVoter = {
    "lastname": "",
    "firstname": "",
    "address_1": "",
    "address_2": "",
    "city": "",
    "state": "",
    "zipcode" : "",
    "phone": "",
    "DOB": "",
    "idsample": "",
    "buddycode": ""
  }
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [currentVoter, setCurrentVoter] = useState(starterVoter);
  const [addressOptions, setAddressOptions] = useState([]);// used to show addresses as the user types 
  const [selectedAddress, setSelectedAddress] = useState();// the address the user chose
  const [addressError,setAddressError] = useState("");// shows if no address was returned or error happens
  const [showSelect, setShowSelect] = useState(false);// controls showing the address select
  const [selectedStreet1, setSelectedStreet1] = useState("");
  const [selectedStreet2, setSelectedStreet2] = useState("");
  const [normalizedStreet, setNormalizedStreet] = useState("");
  const [verified, setVerified] = useState(false);// used to handle selections and updates to address
  const [buddyVerified, setBuddyVerified] = useState(false)
  const [registerToken, setRegisterToken] = useState(null);
  const [showError,setShowError] = useState(false);
  const [errorMsg,setErrorMsg] = useState("some error");

  // const [registered, setRegistered] = useState(false);//to represent that the voter has not registered
  const navigate = useNavigate();
  // for captcha
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (addressOptions && addressOptions.length === 1) {
      setSelectedAddress(addressOptions[0])
      setSelectedStreet1(addressOptions[0].streetLine);
      setSelectedStreet2(addressOptions[0].secondary);
      setNormalizedStreet(addressOptions[0].streetLine);// this will be the value we use in the registration
      let streetInput = document.getElementById('address1');
      if(streetInput && streetInput.value){
        streetInput.value = addressOptions[0].streetLine;
      }
      //setShowSelect(false);
      setVerified(true);
    }

    if(addressOptions && addressOptions.length === 0){
      setSelectedAddress("")
      setSelectedStreet1("");
      setSelectedStreet2("");
      setNormalizedStreet("");// this will be the value we use in the registration
      //setShowSelect(false);
      setVerified(false);
    }
  }, [addressOptions])


  // check captcha val
  const checkCaptcha = async () => {
    const captchaToken = recaptchaRef.current.getValue();
    //recaptchaRef.current.reset();// reset the captcha

    var payload = {};
    payload['token'] = captchaToken;
    try{
      let response = await axios.post(`${config.apiBaseUrl}/register/check-bot`, payload);//await axios.post("https://vote.u-vote.us/register", formData);

      if (response.status === 200 && response.data) {
        setRegisterToken(response.data.regToken); 
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }catch(err){
      setDisabled(true);
    }
   

  }

  // checks to see if the address entered is a real address and offers options 
  const checkAddress = async (val) => {

    if (val.length === 0) {
      return;
    }

    setShowSelect(true);

    try {
      const payload = { address: val };
      let res = await axios.post(`${config.apiBaseUrl}/address`, payload, { withCredentials: true });
      if (res.status === 200) {
        const addressArr = res.data.result;
        if(Array.isArray(addressArr) && addressArr.length > 0){
          setAddressOptions(addressArr);
          setAddressError("");
        }else{
          setAddressError("No results returned, please try again");
          setAddressOptions([]);
        }
      } else {
        setAddressError("Error finding address")
        setAddressOptions([]);
      }
    } catch (err) {
      setAddressError("Error finding address");

    }

  }

  // check to see if the buddy code is valid
  const checkBuddyCode = async (val) => {
    if(val.length === 0){
      return;
    }
    // --- start back up here ---//

    try{

    const payload = { buddycode:val.trim()};

      let res = await axios.post(`${config.apiBaseUrl}/register/check-code`, payload, { withCredentials: true })

      if (res.status === 200) {
        setBuddyVerified(true)
      } else {
        setAddressOptions(false);
      }
    } catch (err) {
      setBuddyVerified(false);
    }
  }
  

  // check fields and attempt to add
  const register = async () => {

    const form = document.getElementById('registerForm');
    const isValid = form.checkValidity();
    // check the disabled fields to make sure they have real values
    const city = form.querySelector('#city');
    const state = form.querySelector('#state');
    const zipcode = form.querySelector('#zipcode');

    if (city.value.length < 2 || state.value.length < 2 || zipcode.value.length < 5) {
      return;
    }

    if(!registerToken){
      return; 
    }

    if (isValid) {
      form.classList.remove('invalid');
      var formFields = form.querySelectorAll('.form-control');
      var genderSelect = form.querySelector('#gender');

      var formData = new FormData();
      for (let i = 0; i < formFields.length; i++) {
        if (formFields[i].type !== "file") {
          if (formFields[i].name === "address1") {
            formData.append(formFields[i].name, normalizedStreet);// used to formalize the address so user doesn't enter something else after it's selected. 
            // if they do, it will be ignored. 
          } else {
            formData.append(formFields[i].name, formFields[i].value);
          }

        }
      }

      formData.append('gender', genderSelect.value);
      formData.append('regToken', registerToken);// received from captcha challenges
      try {
        setLoading(true)
        let res = await axios.post(`${config.apiBaseUrl}/register/buddy`, formData, { withCredentials: true });//await axios.post("https://vote.u-vote.us/register", formData);

        if (res.status === 200) {
          form.reset();
          setShowError(false);
          setLoading(false);
          navigate('/confirm')
        } else {
          setShowError(true);
          setErrorMsg(res.data.reason);
          setLoading(false);
        }

      } catch (err) {
        setLoading(false);
        navigate('/registration-error', {
          state: {
            message: "Error with the registration",
            error: err.response.data.reason,
            retry: "buddy"
          }
        })

      }
    }else{
      form.classList.add('invalid');
    }

  }
  return (
    <Container fluid="md">
      {loading ? (<Spinner></Spinner>) : (
        <>
          <h2>Register with a buddy code</h2>
          <div className='limit-notice'><p>U-Vote is in testing in Arlington Virginia right now. </p></div>
          <p>Voters who register in-person at one of our events or booths, will automatically get a buddy code. You're here because somebody shared that one of those codes with you. A buddy code will eliminate part of the registration process for you and make things just a little quicker.</p>
          <hr className='separator'></hr>

          <Form id="registerForm">
          <h4>Step 1: Enter Your Info</h4>
            <Row className='mb-2'>
              <Col lg={2} md={12}>
                <Form.Label id="aFirst" >First</Form.Label>
              </Col>
              <Col lg={10} md={12}>
                <Form.Control id="firstName" name="firstname" lg={6} type="text" placeholder="first name" defaultValue={currentVoter.firstname} required />
              </Col>
            </Row>
            <Row id="firstError" className="error-txt">

            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aLast">Last</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control id="lastName" name="lastname" type="text" placeholder="last name" defaultValue={currentVoter.lastname} required />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aPhone" >Phone</Form.Label>
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
                <Form.Label id="aDOB">DOB</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control id="DOB" name="DOB" size="lg" type="text" pattern='(0[1-9]|1[1,2,0])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}' min={18} placeholder="MM/DD/YYYY" defaultValue={currentVoter.DOB} required />
                <Form.Text muted>
                  You must be 18 or older
                </Form.Text>
              </Col>

            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aText">Agree to text messages</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Check // prettier-ignore
                  type={'checkbox'}
                  id={'opt-in'}
                  label={'I agree to receive text messages from U-Vote'} required
                />
                <Form.Text id="textHelp">
                  * Agreement is required for U-Vote participation
                </Form.Text>
              </Col>

            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aGender" >Gender</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Select aria-label="Gender" name="gender" id="gender" required defaultValue="F">
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="U">Note Specified</option>
                </Form.Select>
              </Col>
            </Row>
            <hr className='separator'/>
            
            <h4>Step 2: Verify Address</h4>
            <Container fluid  className='formSection'>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aAddress1" >Address</Form.Label>
              </Col>
              <Col lg={8} className='address-check'>
                <Form.Control id="address1" name="address1" lg={6} type="text" maxLength={75} placeholder="enter and select your address" onChange={(e) => {
                    
                     if(verified && normalizedStreet !== e.currentTarget.value){
                      setAddressOptions([]);
                     }
                     else{
                      setSelectedStreet1(e.currentTarget.value)
                     }
                     
                 
                }} value={selectedStreet1} required /> {(verified) ? <img alt="check mark for verified address" src="check2-square.svg" /> : <></>}
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aAddress2" >Address Line 2</Form.Label>
              </Col>
              <Col lg={8} className='address-check'>
                <Form.Control id="address2" name="address2" lg={6} type="text" placeholder="optional ex. apt 3a" onChange={(e) => {
                  setSelectedStreet2(e.target.value);

                }} value={selectedStreet2} />
              </Col>
              <Col lg={2}>
                <Button id="verifyAddress" variant={(verified) ? 'success' : 'warning'} onClick={() => {
                  // need to get the value of the current street address field
                  let streetAddress = document.getElementById('address1');
                  if(streetAddress){
                    const myStreet = streetAddress.value
                    checkAddress(`${myStreet}`)
                  }
                  
                }} >{(verified) ? (<>Address Verified <img alt="check mark for verified address" src="check-square.svg" /></>) : (<span>Verify Address</span>)} </Button>
              </Col>
            </Row>
            {showSelect ? (
            <><Row>
              </Row>
                <Col lg={{span:10,offset:2}}>
                <Alert id="alertVerified" key={"primary"} variant={"primary"}>
                  Select a verified address below
                </Alert>
                </Col>
              <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="verifiedAddress" >Verified Address:</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Select id="address" name="address" lg={6} type="text" minLength={2} placeholder="enter and select your address" onChange={(e) => {
                  
                  setSelectedAddress(addressOptions[e.target.value]);
                  if (addressOptions[e.target.value].streetLine) {
                    setSelectedStreet1(addressOptions[e.target.value].streetLine);
                    setNormalizedStreet(addressOptions[e.target.value].streetLine)
                    setSelectedStreet2(addressOptions[e.target.value].secondary);
                    let streetInput = document.getElementById('address1');
                    if(streetInput && streetInput.value){
                      streetInput.value = addressOptions[0].streetLine;
                    }
                  }

                  setVerified(true);

                  //setShowSelect(false);
                }}
                 className={verified ? 'verified' : 'unverified'} required >
                  {addressOptions.map((itm, ind) => {
                    return <option key={ind} value={ind}>{itm.streetLine} {itm.secondary}</option>
                  })}
                </Form.Select>
              </Col>
            </Row></>) : (<></>)}
            <Row><Col lg={{offset:2,span:8}} className='address-error'>{addressError}</Col></Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aCity">City</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control id="city" name="city" lg={6} type="text" placeholder="city" value={selectedAddress && selectedAddress.city ? selectedAddress.city : ""} required disabled />
              </Col>
            </Row>

            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aState" >State</Form.Label>
              </Col>
              <Col lg={4} className='mb-2'>
                <Form.Control aria-label="State" name="state" id="state" placeholder='state' type="text" value={selectedAddress && selectedAddress.state ? selectedAddress.state : ""} required disabled />
              </Col>
              <Col lg={2}>
                <Form.Label id="aZip" >Zipcode</Form.Label>
              </Col>
              <Col lg={4}>
                <Form.Control aria-label="Zipcode" name="zipcode" id="zipcode" placeholder='zipcode' type="text" value={selectedAddress && selectedAddress.zipcode ? selectedAddress.zipcode : ""} required disabled />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aIDsample">ID sample</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control id="idsample" name="idsample" lg={6} type="text" pattern="[A-z0-9]{4}" min={4} max={4} placeholder="Last 4 characters from your driver's license number" defaultValue={currentVoter.idsample} required  />
                <Form.Text muted>
                  Enter the last 4 from your drivers license number
                </Form.Text>
              </Col>
            </Row>
            </Container>
            <hr className='separator'/>
            <h4>Step 3: Redeem Code</h4>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aBuddy" >Buddy Code</Form.Label>
              </Col>
              <Col lg={2}>
                <Form.Control id="buddycode" name="buddycode" maxLength={8} minLength={8} type="text" pattern="[0-9A-Z]{8}" placeholder="buddy code" defaultValue={currentVoter.buddycode}  className={buddyVerified ? 'verified' : ''}  required />
                <Form.Text id="buddyHelp" muted>
                  Enter the 6 character code sent to you by a friend
                </Form.Text>
              </Col>
            </Row>
            <Row>
            <Col lg={{offset:2,span:3}}>
                <Button id="verifyBuddy" variant={(buddyVerified) ? 'success' : 'warning'} onClick={() => {
                  // need to get the value of the current street address field
                  let buddycode = document.getElementById('buddycode');
                  if(buddycode){
                    const buddycodeVal = buddycode.value
                    checkBuddyCode(`${buddycodeVal}`)
                  }
                  
                }} >{(buddyVerified) ? (<>Verified <img alt="check for buddy code" src="check-square.svg" /></>) : (<span>Verify Buddy Code</span>)} </Button>
              </Col>
            </Row>
            <Row className='mb-4 mt-4' >
              <ReCAPTCHA ref={recaptchaRef} sitekey={"6Le-QPIoAAAAAJT5-G3P009gn52wZR3TLLSBB3Fj"} onChange={() => checkCaptcha()} />
            </Row>
            <Row className='mb-4'>
              <Col lg={3}>
                <Button variant='primary' onClick={() => register()} disabled={disabled}>Register</Button>
              </Col>

            </Row>
           
            <Row>
            { showError ? (<Alert variant='danger'>{errorMsg}</Alert>) : (<></>)}
            </Row>


          </Form>
        </>

      )}

      <hr></hr>
    </Container>
  );
}

export default Buddy;
