import './App.css';
import { Button, Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useState, useEffect } from 'react';

function VoterInfo(props) {

    const [eco, setEco] = useState();
    const [race, setRace] = useState();
    const [lean, setLean] = useState();


    return (
        <Modal show={props.show} onHide={props.hide}>

            <Modal.Dialog className="mt-0">

                <Modal.Header>
                    <Modal.Title>Welcome to U-Vote!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12} className='voter-info-header'>
                            <Col sm={12}>
                                <div className='voter-info-img mt-2 mb-2'><img src="../incognito.svg" alt="you are anonymous" titl="you are anonymous" /> </div>
                                <p>You are here and you are anonymous.</p>
                                <div className='voter-info-callout'>We just need 3 things to best represent you.</div>
                            </Col>
                            <Col sm={12} className='voter-info-note'>
                                <p>Note: This info is only associated with your anonymous key, not with you. We never store this type of data with your registration information. </p>
                            </Col>
                            {/* <Col sm={12}>
                                <Form.Select value={eco} onChange={(e)=>setEco(e.currentTarget.value)}>
                                    <option value="">Select</option>
                                </Form.Select>
                            </Col> */}

                        </Col>
                    </Row>
                    <Form className="voter-info-form">
                        <Row className='data-block'>
                        <Form.Group as={Row} className="mb-3" controlId="formEco">
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
                                        />
                                        <Form.Check
                                            label="Black/African American"
                                            name="race"
                                            type="radio"
                                            id="race-black"
                                        />
                                        <Form.Check
                                            name="race"
                                            label="Asian"
                                            type="radio"
                                            id="race-asian"
                                        />
                                        <Form.Check
                                            label="American Indian or Alaska Native"
                                            type="radio"
                                            name="race"
                                            id="race-native"
                                        />
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Check
                                            name="race"
                                            label="Native Hawaiian or Pacific Islander"
                                            type="radio"
                                            id="race-hawaiian"
                                        />
                                        <Form.Check
                                            name="race"
                                            label="Hispanic/Latino"
                                            type="radio"
                                            id="race-latino"
                                        />
                                        <Form.Check
                                            name="race"
                                            label="Some other race"
                                            type="radio"
                                            id="race-other"
                                        />
                                    
                                    </Col>
                                    </div> 
                                    
                        </Form.Group>
                        </Row>
                        <Row className='data-block'>
                        <Form.Group>
                            <Form.Label>Political Lean</Form.Label>
                            <div key={`inline-radio`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="Left"
                                            name="lean"
                                            type="radio"
                                            id="lean-left"
                                        />
                                        <Form.Check
                                            inline
                                            label="Center"
                                            name="lean"
                                            type="radio"
                                            id="lean-center"
                                        />
                                        <Form.Check
                                            inline
                                            label="Right"
                                            name="lean"
                                            type="radio"
                                            id="lean-right"
                                        />
                                    </div>
                            
                        </Form.Group>   
                        </Row>
                        <Row className='data-block'>
                        <Form.Group>
                           
                            <Form.Label>Income</Form.Label>
                            <div key={`inline-radio`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="under 50k"
                                            name="income"
                                            type="radio"
                                            id="income-50"
                                        />
                                        <Form.Check
                                            inline
                                            label="under 100k"
                                            name="income"
                                            type="radio"
                                            id="income-100"
                                        />
                                        <Form.Check
                                            inline
                                            label="under 200k"
                                            name="income"
                                            type="radio"
                                            id="income-200"
                                        />
                                         <Form.Check
                                            inline
                                            label="over 200k"
                                            name="income"
                                            type="radio"
                                            id="income-over"
                                        />
                                    </div>
                        </Form.Group> 
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={props.hide}>Go!</Button>
                </Modal.Footer>

            </Modal.Dialog>

        </Modal>
    );
}

export default VoterInfo;