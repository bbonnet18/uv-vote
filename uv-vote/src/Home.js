import './App.css';
import { useState } from 'react';
import axios from "axios";
import {Form, Col, Row, Button, Container, Spinner } from "react-bootstrap";
import VoteList from './VoteList';

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



return(
<Container className='mt-2'>
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

