import './App.css';

import config from './config';
import { Col, Row, Button, Container } from "react-bootstrap";
import { useState } from 'react';


function Terms({setAgree,setShow}){


    return (
    <Container>
        <Row>
            <h3>Terms of use</h3>
            <p>terms terms terms</p>
        </Row>
        <Row>
            <Col sm={{offset:6,span:6}}>
                <Button onClick={(e)=> {
                    setAgree(false);
                    setShow(false);
                }   
                } className='mr-md-3'>Cancel</Button>
                <Button onClick={(e)=>{
                    setAgree(true);
                    setShow(false);
                }} >Agree</Button>
            </Col>
        </Row>
    </Container>
    )

}

export default Terms;