import './App.css';
import axios from 'axios';
import config from './config';
import { Col, Row, Form, Button, Container, Spinner } from "react-bootstrap";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function Register() {

  const starterVoter = {
    "lastname": "",
    "firstname": "",
    "address_1": "",
    "address_2": "",
    "city": "",
    "state": "",
    "phone": "",
    "DOB": ""
  }
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [currentVoter, setCurrentVoter] = useState(starterVoter);
  const [addressOptions, setAddressOptions] = useState([]);// used to show addresses as the user types 
  const [selectedAddress, setSelectedAddress] = useState();// the address the user chose
  const [showSelect, setShowSelect] = useState(false);// controls showing the address select
  const [selectedStreet1, setSelectedStreet1] = useState("");
  const [selectedStreet2, setSelectedStreet2] = useState("");
  const [normalizedStreet, setNormalizedStreet] = useState("");

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
      setShowSelect(false);
    }
  }, [addressOptions])


  // check captcha val
  const checkCaptcha = async () => {
    const captchaToken = recaptchaRef.current.getValue();
    //recaptchaRef.current.reset();// reset the captcha

    var payload = {};
    payload['token'] = captchaToken;

    let response = await axios.post(`${config.apiBaseUrl}/register/check-bot`, payload);//await axios.post("https://vote.u-vote.us/register", formData);

    if (response.status === 200) {
      setDisabled(false);
    } else {
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
      let res = await axios.post(`${config.apiBaseUrl}/address`, payload);
      if (res && res.data && res.data.result) {
        setAddressOptions(res.data.result)
      } else {
        setAddressOptions([]);
      }
    } catch (err) {
      alert('unable to register at this time');
    }

  }


  // check fields and attempt to add
  const register = async () => {

    console.log('currentVoter :', currentVoter);
    const form = document.getElementById('registerForm');
    const isValid = form.checkValidity();
    // check the disabled fields to make sure they have real values
    const city = form.querySelector('#city');
    const state = form.querySelector('#state');
    const zipcode = form.querySelector('#zipcode');

    if (city.value.length < 2 || state.value.length < 2 || zipcode.value.length < 5) {
      console.log('need to select an address');
      return;
    }

    if (isValid) {
      form.classList.remove('invalid');
      var formFields = form.querySelectorAll('.form-control');
      var genderSelect = form.querySelector('#gender');
      var idFile = form.querySelector("#idFile")
      var selfyFile = form.querySelector("#selfyFile")

      var formData = new FormData();
      for (let i = 0; i < formFields.length; i++) {
        if (formFields[i].type !== "file") {
          if (formFields[i].name === "address1") {
            console.log('val: ', formFields[i].value);
            formData.append(formFields[i].name, normalizedStreet);// used to formalize the address so user doesn't enter something else after it's selected. 
            // if they do, it will be ignored. 
          } else {
            console.log('val: ', formFields[i].value);
            formData.append(formFields[i].name, formFields[i].value);
          }

        }
      }

      formData.append('gender', genderSelect.value);
      formData.append('idFile', idFile.files[0]);
      formData.append('selfyFile', selfyFile.files[0]);
      console.log('form data');
      try {
        setLoading(true)
        let res = await axios.post(`${config.apiBaseUrl}/register`, formData);//await axios.post("https://vote.u-vote.us/register", formData);
        form.reset();
        if (res.status === 200) {
          setLoading(false);
          navigate('/confirm')
        } else {
          setLoading(false);
          console.log('res is not a 200, but another: ', res.status);
          alert('unable to register,please try live validation');
        }

      } catch (err) {
        setLoading(false);

        navigate('/registration-error', {
          state: {
            message: "Error with the registration",
            error: err.response.data
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
          <h2>Register for a U-Vote Key</h2>
          <div className='limit-notice'><p>U-Vote is in alpha and currently only available in Arlington Virginia. We plan to learn from our experiences in Arlington and expand to your neighborhood sometime soon!</p></div>
          <hr></hr>

          <Form id="registerForm">
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
                <Form.Label id="aAddress1" >Address</Form.Label>
              </Col>
              <Col lg={8} className='address-check'>
                <Form.Control id="address1" name="address1" lg={6} type="text" placeholder="enter and select your address" onChange={(e) => {
                  setSelectedStreet1(e.target.value);

                }} value={selectedStreet1} required /> {(selectedAddress && selectedAddress.city && selectedStreet1) ? <img src="check2-square.svg" /> : <></>}
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
                <Button id="verifyAddress" variant={(selectedAddress && selectedAddress.city && selectedAddress.zipcode) ? 'success' : 'warning'} onClick={() => {
                  checkAddress(`${selectedStreet1} ${selectedStreet2}`)
                }}>Verify Address{(selectedAddress && selectedAddress.city && selectedAddress.zipcode) ? <img src="check-square.svg" /> : <span> ...</span>} </Button>
              </Col>
            </Row>
            {showSelect ? (<Row>
              <Col lg={{ offset: 2, span: 10 }}>
                <Form.Select id="address" name="address" lg={6} type="text" minLength={2} placeholder="enter and select your address" onChange={(e) => {
                  setSelectedAddress(addressOptions[e.target.value]);
                  console.log('vale:', e.target.value)
                  console.log('address: ', addressOptions[e.target.value])
                  if (addressOptions[e.target.value].streetLine) {
                    setSelectedStreet1(addressOptions[e.target.value].streetLine);
                    setSelectedStreet2(addressOptions[e.target.value].secondary);
                  }

                  setShowSelect(false);
                }}
                  required >
                  {addressOptions.map((itm, ind) => {
                    return <option key={ind} value={ind}>{itm.streetLine} {itm.secondary}</option>
                  })}
                </Form.Select>
              </Col>
            </Row>) : (<></>)}

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
            <Row className="img-preview-wrapper" >
              <Col lg={{ span: 4, offset: 2 }} className='step-one'>
                <p><strong>Step 1:</strong> Take a picture of your ID</p>
              </Col>
              <Col className='img-preview mt-2' lg={{ span: 4, offset: 2 }}>
                <img id="previewImg" alt="preview image" src="" />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aFile">ID File:</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control type="file" id="idFile" accept='.jpeg' onChange={(evt) => {
                  let preview = document.getElementById('previewImg');
                  console.log('received a file - ', URL.createObjectURL(evt.target.files[0]));
                  preview.src = URL.createObjectURL(evt.target.files[0]);
                  preview.onload = function () {
                    URL.revokeObjectURL(preview.src) // free memory
                  }
                  preview.classList.add('showing')
                }} required />
              </Col>

            </Row>

            <Row className="img-preview-wrapper" >
              <Col lg={{ span: 4, offset: 2 }} className='step-two'>
                <p><strong>Step 2:</strong>Take a selfy with your ID</p>
              </Col>
              <Col className='img-preview selfy mt-2' lg={{ span: 4, offset: 2 }}>
                <img id="selfyImg" alt="selfy image" src="" />
              </Col>
            </Row>
            <Row>
              <Col lg={2}>
                <Form.Label id="aFile" >Selfy File:</Form.Label>
              </Col>
              <Col lg={10}>

                <Form.Control type="file" id="selfyFile" accept='.jpeg' onChange={(evt) => {
                  let preview = document.getElementById('selfyImg');
                  console.log('received a file - ', URL.createObjectURL(evt.target.files[0]));
                  preview.src = URL.createObjectURL(evt.target.files[0]);
                  preview.onload = function () {
                    URL.revokeObjectURL(preview.src) // free memory
                  }
                  preview.classList.add('showing')
                }} required />
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


          </Form>
        </>

      )}


    </Container>
  );
}

export default Register;
