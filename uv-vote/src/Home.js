import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Alert, Col, InputGroup, Row, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import VoteList from './VoteList';
import config from './config';


function Home() {

  const [votes, setVotes] = useState([{}]);// to hold votes when we get them from the axios call 
  const [voterKey, setVoterKey] = useState(null);// holds the voter key the user entered
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSaved, setIsSaved] = useState(false);// set to false and reset if cookie there
  const [showKey, setShowKey] = useState(false);// make key visible for export
  const [validVoter, setValidVoter] = useState(null);// used to show a message if voter is not valid
  const [checking, setChecking] = useState(false);// used to stop from multiple gets based on useEffect
  const [copyHelp, setCopyHelp] = useState("");// shows hints about the copy/paste key process
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
      let tokenCookie = getCookie('voterToken');
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

  // check the voter's clipboard and paste in the value if it fits the format

  async function getClipboard() {
    if (window.navigator && window.navigator.clipboard) {

      const clipboardData = await window.navigator.clipboard.readText();
      if (clipboardData) {
        // get the key and put it in the key box
        if (keyPattern.test(clipboardData)) {
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


  async function copyToClipboard() {
    try {

      const keyBox = document.getElementById('voterKey');
      let key = "";
      if (keyBox) {
        key = keyBox.value;
      }

      if (key.length && keyPattern.test(key)) {
        if (window.navigator && window.navigator.clipboard) {
          const cb = window.navigator.clipboard;
          const isCopied = await cb.writeText(key);
          setCopyHelp('key copied to the clipboard.')

        }


      } else {
        setCopyHelp('unable to copy key to the clipboard');
      }

    } catch (err) {
      setCopyHelp('Error - unable to copy key to the clipboard');
    }

    let myHelp = document.getElementById('copyHelp');
    if (myHelp.classList.contains('fadeOut')) {
      myHelp.classList.remove('fadeOut');
    }
    setTimeout(() => {
      myHelp.classList.add('fadeOut');
    }, 300)

  }



  // save the key for next time
  //  const clearKey = ()=>{
  //     document.cookie = "voterToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //     setIsSaved(false);
  //     setVotes([{}])

  // }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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
      const authCookie = getCookie('voterToken') || "";
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
      const authCookie = getCookie('voterToken') || "";
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
              <span>{isSaved === true ? 'Voter key saved ' : 'Enter a new voter key '}</span>
              <Button id="showKeyBtn" variant='outline-light' onClick={() => {
                showKeyBox();
              }} ><img src={showKey === true ? "chevron-bar-down.svg" : "chevron-bar-up.svg"} alt='show voter key entry'></img> </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Form.Group className={showKey ? 'mb-1' : 'hide-key-area'} as={Col} lg={4} sm={8}>
            <Row>
              <Col lg={12}>
              <Row>
              <p>If you haven't received a voter key this quarter, click here to validate and receive a new key</p>
              </Row>
              <Row className='mb-2'>
                <Col sm={4}>
                <Button variant='info' onClick={(e)=>navigate('/validate')}>Validate</Button>
                </Col>
              </Row>
              </Col>
              
            </Row>
            <Row>
              <InputGroup className='mb-1'>
                <Form.Control aria-label='voter key' aria-describedby='voter key' id="voterKey" name="voterKey" type="text" pattern="([A-Za-z0-9]){10}v{1}([0-9])+" placeholder="paste in your voter key" required />
                {(voterKey && voterKey.length > 0) ? (<Button id="copyBtn" className='float-end' variant='outline-primary' onClick={async () => { await copyToClipboard(); }}>Copy</Button>) : (<Button id="clipboardBtn" className='float-end' variant='outline-primary' onClick={async () => { await getClipboard(); }}>Paste</Button>)}
              </InputGroup>
            </Row>
            <Row>
              {isSaved === true ? (<div className='re-entry-warning'><strong>You already have a saved key. Only use this area if you want to clear your current key and re-enter a new key.</strong></div>) : (<div>Enter a new voter key. Check your recent text messages from U-Vote to find your latest voter key. If it's been a while, you'll need to re-validate and get a new key.</div>)}
            </Row>
            <Row>
              <Col lg={12} sm={12}>

                <Button id='verifyBtn' variant={isSaved === true ? 'outline-danger' : 'outline-primary'} onClick={() => checkVoter()}>Verify Key</Button>
                <div id="copyHelp" className='copy-help'>{copyHelp}</div>
              </Col>
            </Row>
          </Form.Group>
        </Row>

      </Form>
      <Row>
        {showError ? (<Alert variant='danger'>{ errorMsg }</Alert>) : (<></>)}
      </Row>
      <Row className="">
        <Col lg={12}>
          {loading ?
            <div className='loading-centered'><Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner></div> : <VoteList votes={votes} register={registerToVote}></VoteList>
          }

        </Col>

      </Row>
      <hr></hr>
    </Container>
  )
}

export default Home;

