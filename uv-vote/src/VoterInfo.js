import './App.css';
import { Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import { useState,useEffect } from 'react';

function VoterInfo(props) {

    const [eco,setEco] = useState();
    const [race,setRace] = useState();
    const [lean,setLean] = useState();

    
    return (
        <Modal show={props.show} onHide={props.hide}>

            <Modal.Dialog className="voterinfo-dialog">

                <Modal.Header closeButton>
                <Modal.Title>About U-Vote</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>U-Vote is a non-partisan platform designed to facilitate civil discourse and informed voting among citizens. Our mission is to empower voters by providing them with unbiased information about candidates and issues, while also encouraging respectful dialogue.</p>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formEco">
                            <Form.Label column sm={4}>
                                Race
                            </Form.Label>
                            <Col sm={12}>
                                <Form.Select value={eco} onChange={(e)=>setEco(e.currentTarget.value)}>
                                    <option value="">Select</option>
                                </Form.Select>
                            </Col>
                            <Col sm={12}>
                            <div key={`inline-radio`} className="mb-3">
                                <Form.Check
                                    inline
                                    label="Left"
                                    name="group1"
                                    type="radio"
                                    id="inline-radio-1"
                                />
                                <Form.Check
                                    inline
                                    label="Center"
                                    name="group1"
                                    type="radio"
                                    id="inline-radio-2"
                                />
                                <Form.Check
                                    inline
                                    label="Right"
                                    name="group1"
                                    type="radio"
                                    id="inline-radio-3"
                                />
                            </div>
                            <div key={`inline-radio`} className="mb-3">
                            <Form.Label column sm={4}>
                                Race
                            </Form.Label>
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
                            </div>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.hide}>Close</Button>
                </Modal.Footer>

            </Modal.Dialog>

        </Modal>
    );
}

export default VoterInfo;