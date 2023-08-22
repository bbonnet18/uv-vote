import './App.css';
import axios from "axios";
import { InputGroup, Form, Col, Row, Card, Button, Container, Image, Spinner } from "react-bootstrap";
import VoteList from './VoteList';
import { useState, useEffect } from "react";


function App() {

  var [votes,setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  var [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const getVotes = async()=>{

    let key = document.getElementById('voterKey').value;
    console.log('key : ',key);
    const keyPattern = /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/;

    if(key && keyPattern.test(key)) {
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
    }else{
      alert('incorrect voter key')
    }
    
  }



  return (
    <Container>
      <Form id="voterForm">
      <InputGroup className="mb-3">
        <InputGroup.Text for="voterKey">Enter your voter key:</InputGroup.Text>
        <Form.Control id="voterKey" name="voterKey" size="lg" type="text" placeholder="voter key"  required />
        <Button variant='primary' onClick={()=>getVotes()}>Get Votes</Button>
        <Form.Control.Feedback type="invalid">
              Invalid voter key, your voter key should look something like... a1b2c3d4-e5f6-g7h8-i9j0-k11l12m13n14
        </Form.Control.Feedback>
      </InputGroup>
      </Form>
      <VoteList votes={votes}></VoteList>
    </Container>
  );
}

export default App;
