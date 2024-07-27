import './App.css';
import { Col, Row, Button, Container} from "react-bootstrap";
import { NavLink, useLoaderData } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
function Error({error}) {

    const location = useLocation();

useEffect(()=>{
    console.log('error: ',error);
},[location])

return(
<Container fluid="md" className='mt-2'>
    <p className='error-txt'>Ooops, we had an error with your registration! Please try again.
    If the problem persists, <a href="mailto:benjamin.a.bonnet@gmail.com">let us know</a>.</p>
    <Row className="img-preview-wrapper" >
        <Col className='error-img' lg={12}>            
        </Col>
    </Row>
    <Row>
        <h3>{location.state.message} </h3>
    </Row>
    <Row>
        <Col lg={{span:9,offset:2}} ><p>{(location.state.error) ? location.state.error : 'service error'}</p></Col>
    </Row>
    <Row>
        <p className='confirm-txt'>  <NavLink to="/getkey">Try again</NavLink></p>
    </Row>

</Container>
)
}

export default Error;

