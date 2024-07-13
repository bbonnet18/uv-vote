import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Col, Row, Button, Container, OverlayTrigger, Popover, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import VoteList from './VoteList';
import config from './config';


function Home() {

  const [votes,setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  const [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const [loading,setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaved, setIsSaved] = useState(false);// set to false and reset if cookie there
  const [validVoter,setValidVoter] = useState(null);// used to show a message if voter is not valid
  const keyPattern =  /([A-Za-z0-9]){10}v{1}([0-9])+/gi //  /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/g;
  // new key pattern would be something like - ([A-Z0-9]){10}([A-Z]){2}v([0-9])+/gi
  // because it will include the state 
  const navigate = useNavigate();
  // useEffect(()=>{
    
  // },[searchParams]);

  //run to check if there is a cookie and load the votes
  useEffect(()=>{
      //check for the cookie 
    let key = "";
    if(searchParams && searchParams.size > 0){
      searchParams.forEach((itm,name)=>{
        // check the id passed and pattern match to validate format
        if(name === "id"){
          // if the test passes, set the key and load the votes
          if(keyPattern.test(itm)){
            var keyBox = document.getElementById('voterKey');
            keyBox.value = itm;
            // clear the cookie so user can decide if they want to save this one
            //clearKey();
            checkVoter();
            
          }
        }
      })
    }else{
      // if the token is there, attempt to get votes
      let tokenCookie = getCookie('voterToken');
      if(tokenCookie){
        getVotes();
        setIsSaved(true);
      }else{
        navigate('/validate')
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
   const clearKey = ()=>{
      document.cookie = "voterToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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


  const checkVoter = async()=>{

    try{
      let key = document.getElementById('voterKey').value;
  
      key = key.trim();
      let kp = keyPattern;///[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/

      let myres = keyPattern.test(key);
      console.log('res : ',myres);
      if(key && kp.test(key)) {
        setLoading(true);
        console.log('they match')
        const payload = {
          voterKey:key
        }
        const resObj = await axios.post(`${config.apiBaseUrl}/votes`,payload,{withCredentials:true});
        console.log('resObj: ',resObj);
        
        if(resObj && resObj.data && resObj.data.isVerified === true){
          setIsSaved(true)
          setValidVoter(true);
          getVotes();
        }else{
          console.error('no voter found');
          setValidVoter(false);
        }
        setLoading(false);
      }else{
        alert('incorrect voter key')
      }
    }catch(err){

      setLoading(false);
      setValidVoter(false);
    }
   
    
  }


  const getVotes = async()=>{
    
    setLoading(true);
    try{

      // get the JWT to use for auth
      const authCookie = getCookie('voterToken') || ""; 
      if(authCookie === ""){
        console.log('need to reauth');
        navigate('/confirm'); 
      }
      // get the cookie and set the auth header
      const reqOpts = { 
        headers:{
          "Authorization": `Bearer ${authCookie}`
        },
        withCredentials:true
      }

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-votes`,{},reqOpts);
      console.log(resObj);
      
      if(resObj && resObj.data && resObj.data.votes){
        setVotes(resObj.data.votes);
      }else{
        console.log('no votes returned');
        setValidVoter(false);
      }
      setLoading(false);
    }catch(err){
      setValidVoter(false);
      setLoading(false);
    }
    
  }


  const registerToVote = async(surveyId)=>{

    try{

      // get the JWT to use for auth
      const authCookie = getCookie('voterToken') || ""; 
      if(authCookie === ""){
        console.log('need to reauth')
      }
      // get the cookie and set the auth header
      const reqOpts = { 
        headers:{
          "Authorization": `Bearer ${authCookie}`
        },
        withCredentials:true
      }

      const payload = {
        surveyId:`${surveyId}`
      }

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/register`,payload,reqOpts);
      console.log(resObj);
      
      if(resObj && resObj.data && resObj.data.surveyLink){
        let myVotes = [...votes]
        // add the survey link for the newly registered item
        myVotes = myVotes.map((itm)=>{
          if(itm.surveyId == surveyId){
            itm.link = resObj.data.surveyLink;
          }
          return itm; 
        })

        setVotes(myVotes);
      }else{
        console.log('no votes returned');
        setValidVoter(false);
      }

    }catch(err){
      setValidVoter(false);

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
  
  { (isSaved === false )? (<> <Form.Label >
  Enter your voter key:
  </Form.Label><Form.Control id="voterKey" name="voterKey" type="text" pattern="([A-Z0-9]){10}([A-Z]){2}v([0-9])+" placeholder="paste in your voter key"  required /></>) : (<></>)}
  
 </Form.Group>
{ (isSaved === false) ? ( <Row>
 <Col lg={8}>
<Button className='float-start' variant='outline-primary' onClick={async ()=>{

await getClipboard();

}}>Paste in from clipboard</Button>
 <Button variant='primary' className='float-end'  onClick={()=>checkVoter()}>Verify Voter Key</Button>
 </Col>
 </Row>):(<></>)}

</Form>
<Row>
  { (validVoter === false) ? (<p>No voter found with that voter key. Get started with <a href="/getkey">a voter key</a> or click the 'Get a voter key' option above.</p>): (<></>)}
</Row>
<Row className="">
  <Col lg={12}>
  {loading ? 
     <Spinner animation="border" role="status">
     <span className="visually-hidden">Loading...</span>
   </Spinner> : <VoteList votes={votes} register={registerToVote}></VoteList>
} 
  </Col>
  
</Row>

</Container>
)
}

export default Home;

