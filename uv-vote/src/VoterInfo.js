import './App.css';
import { Button, Col, Container, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useState, useEffect } from 'react';
import config from './config';
import axios from 'axios';

function VoterInfo() {

    const [eco, setEco] = useState();
    const [race, setRace] = useState();
    const [lean, setLean] = useState();

    // submit the voter info to the backend
    const submitVoterInfo = async () => {

        let income = document.getElementById('incomeGroup').querySelector('input[name="income"]:checked');
        let race = document.getElementById('raceGroup').querySelector('input[name="race"]:checked');
        let lean = document.getElementById('leanGroup').querySelector('input[name="lean"]:checked');
        const payload   = {
            income: income ? income.value : null,
            race: race ? race.value : null,
            lean: lean ? lean.value : null
        };

        if(!income || !race || !lean){
            alert('Please fill out all fields before submitting.');
            return;
        }


        const resObj = await axios.post(`${config.apiBaseUrl}/votes/voter-info`, payload ,{withCredentials:true});

        const response = resObj.data;
        if(response.data.status === 'success'){
            // redirect to votes page
            window.location.href = '/votes';
        }else{
            alert('There was an error submitting your information. Please try again later.');
        }
    }


    return (
       <Container className="voter-info-container">
        
                    <Form id="voterInfoForm" className="voter-info-form">
                        <Row className='data-block'>
                        <Form.Group as={Row} className="mb-3" controlId="formRace" id="raceGroup">
                                    <div key={`inline-radio`} className="mb-3">
                                    <Form.Label column sm={4}>
                                            Race
                                    </Form.Label>
                                    <Col sm={6}>
                                    <Form.Check
                                            label="White"
                                            name="race"
                                            type="radio"
                                            id="race-white"
                                            value='White'
                                        />
                                        <Form.Check
                                            label="Black/African American"
                                            name="race"
                                            type="radio"
                                            id="race-black"
                                            value='Black/African American'
                                        />
                                        <Form.Check
                                            name="race"
                                            label="Asian"
                                            type="radio"
                                            id="race-asian"
                                            value='Asian'
                                        />
                                        <Form.Check
                                            label="American Indian or Alaska Native"
                                            type="radio"
                                            name="race"
                                            id="race-native"
                                            value='American Indian or Alaska Native'
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Check
                                            name="race"
                                            label="Native Hawaiian or Pacific Islander"
                                            type="radio"
                                            id="race-hawaiian"
                                            value='Native Hawaiian or Pacific Islander'
                                        />
                                        <Form.Check
                                            name="race"
                                            label="Hispanic/Latino"
                                            type="radio"
                                            id="race-latino"
                                            value='Hispanic/Latino'
                                        />
                                        <Form.Check
                                            name="race"
                                            label="Some other race"
                                            type="radio"
                                            id="race-other"
                                            value='Some other race'
                                        />
                                    </Col>
                                    </div> 
                        </Form.Group>
                        </Row>
                        <Row className='data-block'>
                        <Form.Group as={Row} className="mb-3" controlId="formLean" id="leanGroup">
                            <Form.Label>Political Lean</Form.Label>
                            <div key={`inline-radio`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="Left"
                                            name="lean"
                                            type="radio"
                                            id="lean-left"
                                            value='Left'
                                        />
                                        <Form.Check
                                            inline
                                            label="Center"
                                            name="lean"
                                            type="radio"
                                            id="lean-center"
                                            value='Center'
                                        />
                                        <Form.Check
                                            inline
                                            label="Right"
                                            name="lean"
                                            type="radio"
                                            id="lean-right"
                                            value='Right'
                                        />
                                    </div>
                            
                        </Form.Group>   
                        </Row>
                        <Row className='data-block'>
                        <Form.Group as={Row} className="mb-3" controlId="formIncome" id="incomeGroup">
                            <Form.Label>Income</Form.Label>
                            <div key={`inline-radio`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="under 50k"
                                            name="income"
                                            type="radio"
                                            id="income-50"
                                            value='under 50k'
                                        />
                                        <Form.Check
                                            inline
                                            label="under 100k"
                                            name="income"
                                            type="radio"
                                            id="income-100"
                                            value='under 100k'
                                        />
                                        <Form.Check
                                            inline
                                            label="under 200k"
                                            name="income"
                                            type="radio"
                                            id="income-200"
                                            value='under 200k'
                                        />
                                         <Form.Check
                                            inline
                                            label="over 200k"
                                            name="income"
                                            type="radio"
                                            id="income-over"
                                            value='over 200k'
                                        />
                                    </div>
                        </Form.Group> 
                        </Row>
                        <Button variant="primary" onClick={submitVoterInfo}>
                            Submit
                        </Button>
                    </Form>
         </Container>
    );
}

export default VoterInfo;