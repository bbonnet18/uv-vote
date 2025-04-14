import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Alert, Col, InputGroup, Row, Button, Link, Container, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import VoteList from './VoteList';
import config from './config';


function Home() {

  const [votes, setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  const [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaved, setIsSaved] = useState(false);// set to false and reset if cookie there
  const [showKey, setShowKey] = useState(false);// make key visible for export
  const [showKeyEntry, setShowKeyEntry] = useState(true);// to show the actual key entry and validate box
  const [validVoter, setValidVoter] = useState(null);// used to show a message if voter is not valid
  const keyPattern = /([A-Za-z0-9]){10}v{1}([0-9])+/i //  /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/g;
  const [showError,setShowError] = useState(false);
  const [errorMsg,setErrorMsg] = useState("");
  // new key pattern would be something like - ([A-Z0-9]){10}([A-Z]){2}v([0-9])+/gi
  // because it will include the state 
  const navigate = useNavigate();
  // useEffect(()=>{

  // },[searchParams]);

  //run to check if there is a cookie and load the votes
  useEffect(() => {
    //check for the cookie 
    let key = "";
    if (searchParams && searchParams.size > 0) {
      searchParams.forEach((itm, name) => {
        // check the id passed and pattern match to validate format
        if (name === "id") {
          // if the test passes, set the key and load the votes
          if (keyPattern.test(itm)) {
            var keyBox = document.getElementById('voterKey');
            keyBox.value = itm;
            // clear the cookie so user can decide if they want to save this one
            //clearKey();
            checkVoter();

          }
        }
      })
    } else {
      // if the token is there, attempt to get votes
      let tokenCookie = cookies.getCookie('voterToken');
      if (tokenCookie) {

        getVotes();
        setIsSaved(true);
        setShowKey(false);
      } else {
        setIsSaved(false);
        setShowKey(true);

      }
    }

  }, [])



  const checkVoter = async () => {

    try {
      let key = document.getElementById('voterKey').value;

      key = key.trim();
      let kp = keyPattern;///[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+/

      let myres = key && kp.test(key);

      if (key && kp.test(key)) {
        setLoading(true);

        const payload = {
          voterKey: key
        }
        const resObj = await axios.post(`${config.apiBaseUrl}/votes`, payload, { withCredentials: true });


        if (resObj && resObj.data && resObj.data.isVerified === true) {
          setIsSaved(true);
          setShowKey(false);
          setShowError(false);
          setValidVoter(true);
          getVotes();
        } else { 
          setShowError(true);
          setErrorMsg("no voter found");
          setValidVoter(false);
        }
        setLoading(false);
      } else {
        alert('incorrect voter key')
      }
    } catch (err) {

      setLoading(false);
      setShowError(true);
      setErrorMsg("error getting voter");
      setValidVoter(false);
    }


  }


  const getVotes = async () => {

    setLoading(true);

    try {

      // get the JWT to use for auth
      const authCookie = cookies.getCookie('voterToken') || "";
      if (authCookie === "") {

        navigate('/validate');
      }
      // get the cookie and set the auth header
      const reqOpts = {
        headers: {
          "Authorization": `Bearer ${authCookie}`
        },
        withCredentials: true
      }

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-votes`, {}, reqOpts);


      if (resObj && resObj.data && resObj.data.votes) {
        setShowError(false);
        setVotes(resObj.data.votes);
      } else {

        setShowError(true);
        setErrorMsg("no votes returned");
        setValidVoter(false);
      }
      setLoading(false);
    } catch (err) {
      setShowError(true);
      setErrorMsg("error retrieving votes");
      setValidVoter(false);
      setLoading(false);
    }

  }


  const registerToVote = async (surveyId) => {

    try {

      // get the JWT to use for auth
      const authCookie = cookies.getCookie('voterToken') || "";
      if (authCookie === "") {
        console.log('need to reauth')
      }
      // get the cookie and set the auth header
      const reqOpts = {
        headers: {
          "Authorization": `Bearer ${authCookie}`
        },
        withCredentials: true
      }

      const payload = {
        surveyId: `${surveyId}`
      }

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/register`, payload, reqOpts);

      if (resObj && resObj.data && resObj.data.surveyLink) {
        let myVotes = [...votes]
        // add the survey link for the newly registered item
        myVotes = myVotes.map((itm) => {
          if (itm.surveyId == surveyId) {
            itm.link = resObj.data.surveyLink;
          }
          return itm;
        })
        setShowError(false);
        setVotes(myVotes);
      } else {
        setShowError(true);
        setErrorMsg("no votes returned");

        setValidVoter(false);
      }

    } catch (err) {
      setValidVoter(false);

    }

  }

  const showKeyBox = () => {
    setShowKey(!showKey);
  }

  const toggleKeyEntry = () => {
    setShowKeyEntry(!showKeyEntry);
  }


  return (
    <Container fluid="md" className='mt-2'>

      <p>Your votes will be presented below.</p>
      <hr></hr>
      <Form id="voterForm" className='mb-3'>
        <Row className='mb-1'>
          <Col lg={6} xs={6}>
            <Row>
              <Col lg={3} xs={12}>
              <img src="ballot_sm.png" alt="ballot type vote" title="ballot type vote"></img> <span> - Ballot vote</span>
              </Col>
              <Col lg={4} xs={12}>
              <img src="perspective_sm.png" alt="perspective type vote" title="perspective type vote"></img><span> - Perspective vote </span>
              </Col>
              <Col lg={5} xs={12}>
              <span><a href="/faqs" alt="more about vote types">Learn more about vote types</a></span>
              </Col>
            </Row>
          </Col>
          <Col lg={{span:3, offset:3}} xs={6} className='float-end'>
            <div className="action-right">
              <span>Manage Voter Key </span>
              <Button id="showKeyBtn" variant='outline-light' onClick={() => {
                showKeyBox();
              }} ><img src={"key.svg"} alt='show voter key entry'></img> </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Form.Group className={showKey ? 'mb-1' : 'hide-key-area'} as={Col} lg={12}>
            <Row>
              <Col lg={12} className="voter-key">
              {isSaved === false ? (<h4 class="no-voter"><img src='exclamation-mark.png' alt="error -no voter"/>No Voter Key Found</h4>) : (<></>)}
              <Row>
              {isSaved === false ? (<><div><strong>New to U-Vote?</strong> Get a voter key by <a href="/getkey">registering</a>.</div><p><strong>First time voting this quarter?</strong> Go to <a href="/validate" alt="validate to receive voter key">validate</a> and receive a new key.</p></>) : (<></>)}
              {isSaved === true ? (<div className='re-entry-warning'><strong>You already have a saved key. Only use this area if you want to clear your current key and re-enter a new key.</strong></div>) : (<div><p><strong>Already have a current voter key?</strong></p> <div>Check your recent text messages from U-Vote to find your latest voter key. If it's been a while, you'll need to <a href="/validate" alt="validate to receive voter key">validate</a> and get a new key.</div></div>)}
             <div>If you have your key, click <Button id="showKeyEntry" variant='link' className='btn-sm mt-1' onClick={() => {
                toggleKeyEntry();
              }}>here</Button> to enter it </div>
              </Row>
              <Row>
                <Col lg={4} sm={8}>
                {showKeyEntry ? (  <Row>
              <InputGroup className='mb-1'>
                <Form.Control aria-label='voter key' aria-describedby='voter key' id="voterKey" name="voterKey" type="text" pattern="([A-Za-z0-9]){10}v{1}([0-9])+" placeholder="paste in your voter key" required />
                <Button id="verifyBtn" className='float-end' variant='outline-primary' onClick={() => checkVoter()}>Verify Key</Button>
              </InputGroup>
            </Row>):(<></>)}
                </Col>
              </Row>
              
              </Col>
              
            </Row>
           
          </Form.Group>
        </Row>

      </Form>
      <Row>
        {showError ? (<Alert variant='danger'>{ errorMsg }</Alert>) : (<></>)}
      </Row>
      <Row>
        <Col lg={12}>
        <>
          {loading ?
            (<div className='loading-centered'><Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner></div>) : (isSaved === true  ? (<VoteList votes={votes} register={registerToVote}></VoteList>):(<></>))
          }
        </>
        </Col>

      </Row>
      <hr></hr>
    </Container>
  )
}

export default Home;

