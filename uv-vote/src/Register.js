import './App.css';
import axios from 'axios';


import { InputGroup, Form, Button, Container, Spinner } from "react-bootstrap";
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
      var genderSelect = form.querySelector('#aGender');
      var stateSelect = form.querySelector('#aState');
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

      setLoading(true)
      let res = await axios.post("http://localhost:3003/register", formData);
      form.reset();
      console.log(res);
      setLoading(false)
    } else {
      form.classList.add('invalid');
      console.log('not valid')
    }

  }
  return (
    <Container>
        {loading ? (<Spinner></Spinner>):(
          <>
              <h2>Add Voter</h2>
             <Form id="registerForm">
               <InputGroup className="mb-3">
                 <InputGroup.Text id="aFirst">First</InputGroup.Text>
                 <Form.Control id="firstName" name="firstname" size="lg" type="text" placeholder="first name" defaultValue={currentVoter.firstname} required />
                 <InputGroup.Text id="aLast" className='form-col'>Last</InputGroup.Text>
                 <Form.Control id="lastName" name="lastname" size="lg" type="text" placeholder="last name" defaultValue={currentVoter.lastname} required />
               </InputGroup>
               <InputGroup className='mb-3'>
                 <InputGroup.Text id="aCity">City</InputGroup.Text>
                 <Form.Control id="city" name="city" size="lg" type="text" minLength={2} placeholder="city" defaultValue={currentVoter.city} required />
                 <InputGroup.Text id="aState-addon1" className='form-col' >State</InputGroup.Text>
                 {/* <Form.Control id="state" name="state" size="lg" type="text" minLength={2} maxLength={2} placeholder="state" defaultValue={currentVoter.state} required/> */}
                 <Form.Select aria-label="State" name="state" id="aState" required defaultValue="F">
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
               </InputGroup>
               <InputGroup className='mb-3'>
                 <InputGroup.Text id="aPhone" >Phone</InputGroup.Text>
                 <Form.Control id="phone" name="phone" size="lg" type="tel" placeholder="phone" defaultValue={currentVoter.phone} required />
                 <InputGroup.Text id="aAge" className='form-col' >Age</InputGroup.Text>
                 <Form.Control id="age" name="age" size="lg" type="number" placeholder="age" defaultValue={currentVoter.state} required />
               </InputGroup>
               <InputGroup className='mb-3'>
                 <Form.Check // prettier-ignore
                   type={'checkbox'}
                   id={'opt-in'}
                   label={'Agree to receive text messages'} required
                 />
               </InputGroup>
               <InputGroup className='mb-3'>
                 <Form.Select aria-label="Gender" name="gender" id="aGender" required defaultValue="F">
                   <option value="F">Female</option>
                   <option value="M">Male</option>
                   <option value="U">Unknown</option>
                 </Form.Select>
               </InputGroup>
               <InputGroup  className='mb-3'>
                <InputGroup.Text id="aFile" >ID File:</InputGroup.Text>
                <Form.Control type="file" id="idFile" required/>
               </InputGroup>
               <Button variant='primary' onClick={() => register()}>Submit</Button>
             </Form>
          </>
           
        )}
     
    </Container>
  );
}

export default Register;
