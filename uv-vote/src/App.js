import './App.css';
import axios from "axios";
import { InputGroup, Form, Col, Row, Card, Button, Container, Image, Spinner } from "react-bootstrap";
import VoteList from './VoteList';
import { useState, useEffect } from "react";


function App() {

  var [votes,setVotes] = useState([{}]);// to hold votes when we get them from the axios call 

  const getVotes = async()=>{
    const votes = await axios.get("https://vote.u-vote.us/limeapi/participant-surveys");
    console.log(votes);
    if(votes && votes.data){
      setVotes(votes.data);
    }else{
      console.error('no votes returned');
    }
  }



  return (
    <Container>
      <Form id="voterForm">
      <InputGroup className="mb-3">
        <InputGroup.Text id="voterKey">Enter your voter key:</InputGroup.Text>
        <Form.Control id="voterKey" name="voterKey" size="lg" type="text" placeholder="voter key" defaultValue={'drop your voter key here'} required />
        <Button variant='primary' onClick={()=>getVotes()}>Get Votes</Button>
      </InputGroup>
      </Form>
      <VoteList votes={votes}></VoteList>
    </Container>
  );
}

export default App;
