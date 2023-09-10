import './App.css';
import { useState } from 'react';
import axios from "axios";
import {Accordion, Form, Col, Row, Button, Container, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import VoteList from './VoteList';
import { NavLink } from 'react-router-dom';

function Home() {

    const [votes,setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  const [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const [loading,setLoading] = useState(false);
 
  const getVotes = async()=>{

    let key = document.getElementById('voterKey').value;
    console.log('key : ',key);
    const keyPattern = /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/;

    if(key && keyPattern.test(key)) {
      setLoading(true);
      console.log('they match')
      const payload = {
        voterKey:key
      }
      const votes = await axios.post("https://vote.u-vote.us/limeapi/participant-surveys",payload);
      console.log(votes);
      
      if(votes && votes.data){
        setVotes(votes.data);
      }else{
        console.error('no votes returned');
      }
      setLoading(false);
    }else{
      alert('incorrect voter key')
    }
    
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
  );


return(
<Container className='mt-2'>
    <nav>
    <NavLink to="/getkey">Get a voter key</NavLink> | <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <Button ><img src="key.svg" alt="key" width="30" height="30"></img></Button>
    </OverlayTrigger>
    </nav>
    <p>Welcome to U-Vote. Enter your voter key to see your votes. Register here to get a voter key.</p>
<hr></hr>

<Form id="voterForm" className='mb-3'> 
 <Form.Group className='mb-3' as={Col} lg={8}>
  <Form.Label >
  Enter your voter key:
  </Form.Label>
  <Form.Control id="voterKey" name="voterKey" type="text" placeholder="voter key"  required />
 </Form.Group>
 <Button variant='primary'  onClick={()=>getVotes()}>Get Votes</Button>
</Form>
<Row className="justify-content-md-center">
  <Col lg={12}>
  {loading ? 
     <Spinner animation="border" role="status">
     <span className="visually-hidden">Loading...</span>
   </Spinner> : <VoteList votes={votes}></VoteList>
} 
  </Col>
  
</Row>

</Container>
)
}

export default Home;

