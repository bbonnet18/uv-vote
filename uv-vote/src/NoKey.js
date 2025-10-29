import './App.css';
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import Quotes from './Quotes';
import { useState,useEffect } from 'react';

function NoKey (){

    return (
        <Container className='no-key'>
            <Row><h3>Oops, no voter key found!</h3></Row>
            <Row>
                <Col xs={12}>
                    <div>
                        <img src='../exclamation-triangle-red.svg' title='no voter key found' alt='no voter key found' />
                    </div>
                </Col>
            </Row>
            <Row className='no-key-info'>
                <p>No Voter Key detected. Find your latest text message from U-Vote with your Voter Key and link.</p>
                <p>If you are new to U-Vote, get started by <a href="/getkey" title="get a voter key" >registering</a> for to get a Voter Key.</p>
            </Row>
        </Container>
    )
} 

export default NoKey; 