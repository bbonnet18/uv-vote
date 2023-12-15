import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Form, Col, Row, Button, Container, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import VoteList from './VoteList';
import config from './config';


function Home() {

    const [votes,setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  const [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const [loading,setLoading] = useState(false);
  const keyPattern = /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/g;
  

  // check the voter's clipboard and paste in the value if it fits the format

    async function getClipboard(){

      console.log('env vars: ', process.env)
      if(window.navigator && window.navigator.clipboard){

        const clipboardData = await window.navigator.clipboard.readText();
        if(clipboardData){
          // get the key and put it in the key box
          if(keyPattern.test(clipboardData)){
            const matches = clipboardData.match(keyPattern); 
            const key = matches[0];
            setVoterKey(key);
          }

        }
      }
    }




  const getVotes = async()=>{

    let key = document.getElementById('voterKey').value;
    key = key.trim();
    let kp = /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/
    if(key && kp.test(key)) {
      setLoading(true);
      console.log('they match')
      const payload = {
        voterKey:key
      }
      const votes = await axios.post(`${config.apiBaseUrl}/limeapi/participant-surveys`,payload);
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
<Container fluid="md" className='mt-2'>
  
    <p>Welcome to U-Vote. Enter your voter key to see your votes. Register here to get a voter key.</p>
<hr></hr>
<Form id="voterForm" className='mb-3'> 
 <Form.Group className='mb-3' as={Col} lg={8}>
  <Form.Label >
  Enter your voter key:
  </Form.Label>
  <Form.Control id="voterKey" name="voterKey" type="text" placeholder="paste in your voter key" defaultValue={voterKey && keyPattern.test(voterKey) ? voterKey : ""}  required />
 </Form.Group>
 <Row>
 <Col lg={8}>
<Button className='float-start' variant='outline-primary' onClick={async ()=>{

await getClipboard();

}}>Paste in from clipboard</Button>
 <Button variant='primary' className='float-end'  onClick={()=>getVotes()}>Get Votes</Button>
 </Col>
 </Row>

</Form>
<Row className="">
  <Col lg={8}>
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

