import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Col, Alert, Row, Button, Container, Tab, Tabs, Spinner } from "react-bootstrap";
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';
import unescape from 'validator/lib/unescape';

function Conduit() {

  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentGroup,setCurrentGroup] = useState("Local");
  const [currentTopic,setCurrentTopic] = useState(null);
  const [tryComment, setTryComment] = useState(false);
  const [show, setShow] = useState(false); 
  const [alertTitle, setAlertTitle] = useState('Success!')
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState('success')
  const [completedIds, setCompletedIds] = useState({}); 
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
      await getTopics();
     
    }

    checkTopics();

  }, [groups])


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
      // check for topics first and if not there, go get them 
      if (groups[group] && groups[group].hasOwnProperty('topics') === false) {
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

        let voterTopics = [];
        const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-topics`, { groupId: groups[group].gsid }, reqOpts);
        if (resObj && resObj.data.Items) {
          let groupObj = { ...groups };// set a new object to replace groups
          // unescape the topic if it was escaped
          groupObj[group].topics = resObj.data.Items.map((itm) => {
            let unescapedTopic = unescape(itm.topic);
            itm.topic = unescapedTopic;
            return itm;
          });
          voterTopics = groupObj[group].topics; 
          setGroups(groupObj);
        }
        await checkComments(voterTopics);
      }

    } catch (err) {
      return;
    }

  }


  const checkComments = async (topics) => {
     try{
      
      if(!topics){
        return; 
      }
      let checkCompleted = [];// to hold array of promises 
      // create promises for each 
      if(topics && topics.length){
        checkCompleted = topics.map(async (itm)=>{
          return await checkComment(itm.groupId, itm.topicId);
        })
      }
      if(checkCompleted.length){
        let didComplete = await Promise.all(checkCompleted);


        if(didComplete && didComplete.length){
          let idMap = {};// to be filled with the completed Ids
          didComplete.map((itm)=>{
            if(itm && itm.groupId){
              if(idMap[`group${itm.groupId}`]){
                  idMap[`group${itm.groupId}`][`topic${itm.topicId}`] = itm.hasCommented;
              }else{
                idMap[`group${itm.groupId}`] = {};
                idMap[`group${itm.groupId}`][`topic${itm.topicId}`] = itm.hasCommented;
              }
            }
          })
          setCompletedIds(idMap);
        }
      }

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
    let topicId = currentTopic;
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

    }catch(err){
      setAlertType('danger');
      setAlertTitle('Error');
      setAlertMsg(reason.error);
      setTryComment(false);
      setShow(true);
    }
  }



  return (<Container fluid="md">
    <Tabs onSelect={async (e) => {
      let groupName = e; 
      setCurrentGroup(groupName);
      let group = groups[groupName] || "";
      if (group && group.hasOwnProperty('topics') === false) {
        await getTopics(groupName);
      }
      return;

    }}>
      {loading ? (<Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner>) : (<></>)}
      {(loading === false && groups) ? Object.keys(groups).map((itm, ind) => {
        return (
          <Tab eventKey={itm} title={itm} key={ind}>
            <div>Current Group: {groups[currentGroup].gsid}</div>
            <div>Title: {groups[itm].title}</div>
            <div>Description: {groups[itm].description}</div>
            <div>Current Topic: {currentTopic}</div>
            {groups[itm] && groups[itm].topics ? (
             <><div>We have topics:</div>
             <ul>
             {groups[itm].topics.map((itm,ind) => {
              return (<li key={ind}>{decodeURIComponent(itm.topic)} - <Button onClick={async (e)=>{
                let topicId = itm.topicId;
                let groupId = groups[currentGroup].gsid;
                console.log('Group: ', groupId, ' Topic: ', topicId); 
                setCurrentTopic(topicId);
                let hasCommented = await checkComment(groupId,topicId);

              }}>Check for comment</Button></li>)
             })}
             </ul>  
             <Button onClick={()=>setTryComment(!tryComment)}>Show Commment</Button>
             {tryComment ? (<Comment show={tryComment} hide={setTryComment} send={sendComment}></Comment>):("")}
             {show ? (
              <Alert className='mt-2' variant={alertType} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{alertTitle}</Alert.Heading>
        <p>
          {alertMsg}
        </p>
      </Alert>
             ):(<></>)}
             </>
            ):(<div>No topics yet</div>)}
          </Tab>
        )
      }) : (<></>)
      }
    </Tabs>
  </Container>)


}

export default Conduit;