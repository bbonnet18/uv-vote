import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Col, Alert, Row, Button, Container, Table, Tab, Tabs, Toast, Spinner } from "react-bootstrap";
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';
import unescape from 'validator/lib/unescape';

function Conduit() {

  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentGroup,setCurrentGroup] = useState("Local");
  const [currentTopics,setCurrentTopics] = useState([]);
  const [currentTopic,setCurrentTopic] = useState(null);
  const [tryComment, setTryComment] = useState(false);
  const [show, setShow] = useState(false); 
  const [alertTitle, setAlertTitle] = useState('Success!')
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState('success')
  //const [completedIds, setCompletedIds] = useState({}); 
  const reason = {
    'success' : 'Your comment was created successfully.',
    'error':'There was an error creating your comment, please try again.',
    'duplicate':'We already have a comment from this voter on this topic.'
  }
  const navigate = useNavigate();

  // get the set of groups if not already there
  useEffect(() => {
    setLoading(true);
    const checkGroups = async () => {

      let conduitGroups = {
        Local: {},
        State: {},
        National: {}

      };

      setLoading(true)
      try {
        let checkGroups = await getGroups();
        if (checkGroups) {
          let keys = Object.keys(checkGroups.data);
          keys.map((key) => {
            if (key === 'state') {
              conduitGroups.State = checkGroups.data[key];
            }
            if (key === 'city') {
              conduitGroups.Local = checkGroups.data[key];
            }
            if (key === 'national') {
              conduitGroups.National = checkGroups.data[key];
            }
          }
          )
        }
        setGroups(conduitGroups);
        setLoading(false);
      } catch (err) {
        setLoading(false); 
      }

      setLoading(false);
    }

    checkGroups();

  }, []);

  useEffect(() => {
    const checkTopics = async () => {
      await getTopics(currentGroup);
    }

    checkTopics();

  }, [groups,currentGroup])


  const getGroups = async () => {

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

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-groups`, {}, reqOpts);
      return resObj;
    } catch (err) {
      return {};
    }

  }


  const getTopics = async (group) => {

    try {

      // check if groups have been established and if the group 
      // exists first
      if (!groups && !groups[group]) {
        return;
      }
      let thisGroup = groups[group]
      // check for topics first and if not there, go get them 
       //if (groups[group] && groups[group].hasOwnProperty('topics') === false) {
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

        const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-topics`, { groupId: thisGroup.gsid, active:true }, reqOpts);
        if (resObj && resObj.data.Items) {
          //let groupObj = { ...groups };// set a new object to replace groups
          // unescape the topic if it was escaped
          let voterTopics = resObj.data.Items.map((itm) => {
            let unescapedTopic = unescape(itm.topic);
            itm.topic = unescapedTopic;
            return itm;
          });
          
          let checkedTopics = await checkComments(voterTopics);

          //groupObj[group].topics = checkedTopics;
          setCurrentTopics(checkedTopics);


          //setGroups(groupObj);
       }
        
      //}

    } catch (err) {
      return;
    }

  }


  const checkComments = async (topics) => {
     try{
      
      if(!topics){
        return; 
      }
      let checkedTopics = [];// to hold array of promises 
      // create promises for each 
      let topicCount = 0;
      
      while(topicCount < topics.length){
        let itm = topics[topicCount]; 
        let hasCompleted = await checkComment(itm.groupId, itm.topicId);
        if(hasCompleted && hasCompleted.groupId){
          
            itm.hasCommented = hasCompleted.hasCommented;
        } 
        checkedTopics.push(itm); 
        topicCount += 1; 
      }
     
        return checkedTopics;
      }catch(err){
        console.log('no topics ')
      }
  }

  const checkComment = async (groupId,topicId) => {
    if(!groupId || !topicId){
      return;
    }
    try{
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

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/check-comment`, {
        groupId:groupId,
        topicId:topicId,
      }, reqOpts);

      if(resObj && resObj.data){
       return resObj.data;
      }else{
        return {};
      }

    }catch(err){
      return {};
    }
  }

  // sends the comment to be posted 
  const sendComment = async (comment)=>{
    let groupId = groups[currentGroup].gsid;
    let topicId = currentTopic.topicId;
    if(!groupId || !topicId || !comment){
      return;
    }
    try{
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

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/create-comment`, {
        groupId:groupId,
        topicId:topicId,
        comment:comment
      }, reqOpts);

      if(resObj && resObj.status === 200){
        setAlertType('success');
        setAlertTitle('Success!');
        setAlertMsg(reason.success);
      }else{
        setAlertType('danger');
        setAlertTitle('Voter already commented');
        setAlertMsg(reason.duplicate);
      }
      
      setTryComment(false);
      setShow(true);

      await getTopics(currentGroup);

    }catch(err){
      setAlertType('danger');
      setAlertTitle('Error');
      setAlertMsg(reason.error);
      setTryComment(false);
      setShow(true);
    }
  }



  return (<Container fluid="md">
      <h2>Conduit <img src="../conduit.png" className='conduit-title' alt="conduit" title="conduit" /></h2>
      <p>Conduit is a service that allows you to make a comment on a specific topic. Your comment goes directly to a feed that we publish specifically for your elected officials, candidates and public officials.</p>
      <hr></hr>
     {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>) : (

      <Tabs onSelect={async (e) => {
      let groupName = e; 
      setCurrentGroup(groupName);
      let group = groups[groupName] || "";
      if (group && group.hasOwnProperty('topics') === false) {
        await getTopics(groupName);
      }
      return;

    }}>
     
      {(loading === false && groups) ? Object.keys(groups).map((itm, ind) => {
        return (
          <Tab eventKey={itm} title={itm} key={ind}>
            
            <h4 className='mt-1'>{groups[itm].title}  <img src={`../${groups[itm].name}.png`} alt={groups[itm].name} title={groups[itm].name} className='table-group-img'></img></h4>
            <Row>
              <Col lg={6} xs={12}><p>Description: {groups[itm].description}</p></Col>
               {show ? (
              <Col lg={6} xs={12}>
                <Toast className='conduit-toast' bg={alertType} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                  <Toast.Header>
                    <strong className="me-auto">{alertTitle}</strong>
                  </Toast.Header>
                  <Toast.Body>{alertTitle} {alertMsg}</Toast.Body>
                </Toast>
              </Col>
             ):(<></>)}
            </Row>
            
            
            {currentTopics ? (
             <>
             <Table key={ind} striped bordered hover>
             <thead>
                <tr>
                  <th>Topics</th>
                  <th className='table-link-col'>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTopics.map((itm,ind) => {
              return (
              <tr key={ind} className={itm.hasCommented ? 'vote-completed' : ''}>
                <td>{decodeURIComponent(itm.topic)}</td>
                <td className='table-link-col'>{itm.hasCommented ? (<div><img src='../check-square.svg' alt='comment completed' title='comment completed'></img></div>):(
                  <Button variant='primary' onClick={(e)=>{
                let topic = itm;
                setCurrentTopic(topic);
                setTryComment(true);
              }}>Comment</Button>
                )}</td>
              </tr>
             )
             }
             )
             }
              </tbody>
            </Table> 

             {tryComment && currentTopic ? (<Comment show={tryComment} hide={setTryComment} send={sendComment} topic={currentTopic.topic}></Comment>):("")}
            
             </>
            ):(<div>No topics yet</div>)}
          </Tab>
        )
      }) : (<></>)
      }
   
    </Tabs>
   

     )}
    
  </Container>)


}

export default Conduit;


/**
 * <Button onClick={async (e)=>{
                let topicId = itm.topicId;
                let groupId = groups[currentGroup].gsid;
                console.log('Group: ', groupId, ' Topic: ', topicId); 
                setCurrentTopic(topicId);
                let hasCommented = await checkComment(groupId,topicId);

              }}>Check for comment</Button>
 */