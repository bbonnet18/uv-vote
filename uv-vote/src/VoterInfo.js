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
                                Economic Perspective
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Select value={eco} onChange={(e)=>setEco(e.currentTarget.value)}>
                                    <option value="">Select</option>
                                </Form.Select>
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