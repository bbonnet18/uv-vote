import './App.css';

import config from './config';
import { Col, Row, Button, Container } from "react-bootstrap";
import { useState } from 'react';


function Terms({setAgree}){


    return (
    <Container>
        <Row>
            <h3>Terms of use</h3>
            <p>terms terms terms...</p>ß
        </Row>
        <Row>
            <Col lg={{span:4,offset:8ß}}>
            <Button variant='info' className='mr-lg-1'>
                Cancel
            </Button>
            <Button variant="primary">
                Agree
            </Button>
            </Col>
        </Row>
    </Container>
    )

}