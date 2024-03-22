import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Col, Row, Button, Container, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import VoteList from './VoteList';
import config from './config';


function Home() {

  const [votes,setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  const [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const [loading,setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaved, setIsSaved] = useState(false);// set to false and reset if cookie there
  const keyPattern = /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/g;
  
  // useEffect(()=>{
    
  // },[searchParams]);

  //run to check if there is a cookie and load the votes
  useEffect(()=>{
      //check for the cookie 
     console.log('searchParams: ',searchParams);
    let key = "";
    if(searchParams && searchParams.size > 0){
      searchParams.forEach((itm,name)=>{
        // check the id passed and pattern match to validate format
        if(name === "id"){
          // if the test passes, set the key and load the votes
          if(keyPattern.test(itm)){
            var keyBox = document.getElementById('voterKey');
            keyBox.value = itm;
            getVotes();
            // clear the cookie so user can decide if they want to save this one
            document.cookie = "key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
        }
      })
    }else{
      let keyCookie = getCookie('key');
      if(keyCookie){
        var keyBox = document.getElementById('voterKey');
        keyBox.value = keyCookie;
        getVotes();
        setIsSaved(true);
      }
    }
    
  },[])
  // check the voter's clipboard and paste in the value if it fits the format

    async function getClipboard(){
      if(window.navigator && window.navigator.clipboard){

        const clipboardData = await window.navigator.clipboard.readText();
        if(clipboardData){
          // get the key and put it in the key box
          if(keyPattern.test(clipboardData)){
            const matches = clipboardData.match(keyPattern); 
            const key = matches[0];
            var keyBox = document.getElementById('voterKey');
            keyBox.value = key;
            setVoterKey(key);
            return key;
          }

        }
      }
    }

  // save the key for next time
  const saveKey = ()=>{
    var keyBox = document.getElementById('voterKey');
    let key = keyBox.value;
    if(keyPattern.test(key)){
      document.cookie = `key=${key}`;

      const d = new Date();
      const exdays = 60;
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = "key" + "=" + key + ";" + expires + ";path=/";
      setIsSaved(true);
    }
    
    
  }

   // save the key for next time
   const clearKey = ()=>{
      document.cookie = "key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      var keyBox = document.getElementById('voterKey');
      keyBox.value = "";
      setIsSaved(false);
      setVotes([{}])
    
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
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
  { (isSaved === false )? (<Button variant='success' className='btn-sm float-end hide-key' onClick={()=>{
    saveKey();
  }}>Trust this device</Button>) : (<Button variant='danger' className='btn-sm float-end hide-key' onClick={()=>{
    clearKey();
  }}>Clear Key</Button>)}
  <Form.Control id="voterKey" name="voterKey" type="text" pattern="[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+" placeholder="paste in your voter key"  required />
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

