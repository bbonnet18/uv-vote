import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Col, Alert, Row, Button, Container, Nav, OverlayTrigger, Table, Tab, Tabs, Toast, Tooltip, Spinner, ToastContainer } from "react-bootstrap";
import Comment from './Comment';
import Receiver from './Receiver';
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';
import unescape from 'validator/lib/unescape';

function Conduit() {

  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [groupsSet, setGroupsSet] = useState(false);
  const [currentGroup, setCurrentGroup] = useState("Local");
  const [currentTopics, setCurrentTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [tryComment, setTryComment] = useState(false);
  const [tryReceiver, setTryReceiver] = useState(false);
  const [show, setShow] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Success!')
  const [alertMsg, setAlertMsg] = useState("Thanks for submitting your comment");
  const [alertType, setAlertType] = useState('success');
  //const [completedIds, setCompletedIds] = useState({}); 
  const reason = {
    'success': 'Your comment was created successfully.',
    'error': 'There was an error creating your comment, please try again.',
    'duplicate': 'We already have a comment from this voter on this topic.'
  }
  const navigate = useNavigate();

  // get the set of groups if not already there
  useEffect(() => {
    setLoading(true);      

    const checkTopics = async (topicGroups,topicReceivers) => {
      try{
          if(topicGroups && topicGroups.Local && topicGroups.State && topicGroups.National){
            let localTopics = await getTopics(topicGroups["Local"],topicReceivers);
            let stateTopics = await getTopics(topicGroups["State"],topicReceivers);
            let nationalTopics = await getTopics(topicGroups["National"],topicReceivers);
            let newGroups = {...topicGroups};
            newGroups["Local"].topics = localTopics;
            newGroups["State"].topics = stateTopics;
            newGroups["National"].topics = nationalTopics;
            return newGroups;
          }
          let noGroups = {...topicGroups}
          noGroups["Local"].topics = [];
          noGroups["State"].topics = [];
          noGroups["National"].topics = [];
          return noGroups; 
      }catch(err){
        let errorGroups = {...topicGroups}
        errorGroups["Local"].topics = [];
        errorGroups["State"].topics = [];
        errorGroups["National"].topics = [];
        return errorGroups; 
      }
    }


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
        
        setCurrentGroup("Local");
        let topicReceivers = await getReceivers();
        let topicGroups = await checkTopics(conduitGroups,topicReceivers);
        setGroups(topicGroups);
        setCurrentGroup('Local');
        let currentTopics = topicGroups['Local'].topics;
        setReceivers(topicReceivers); 
        setCurrentTopics(currentTopics);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }

      setLoading(false);
    }

    if(groupsSet === false){
      checkGroups();
      setGroupsSet(true);
    }
    

  }, []);

 

  useEffect(()=>{
    let newTopics = groups[currentGroup] && groups[currentGroup].topics || [];
    setCurrentTopics(newTopics);
  },[currentGroup,groups])

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


  const getTopics = async (group,topicReceivers) => {

    try {

      // check if groups have been established and if the group 
      // exists first
      if(!group || !topicReceivers){
        return {};
      }
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

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-topics`, { groupId: group.gsid, active: true }, reqOpts);
      if (resObj && resObj.data.Items) {
        // unescape the topic if it was escaped
        let voterTopics = resObj.data.Items.map((itm) => {
          let unescapedTopic = unescape(itm.topic);
          itm.topic = unescapedTopic;
          itm.tags = createTags(itm.tags,topicReceivers);
          return itm;
        });

        let checkedTopics = await checkComments(voterTopics);


        return checkedTopics; 
      }

    } catch (err) {
      return {};
    }

  }

  const getReceivers = async () => {
    try {

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

      const resObj = await axios.post(`${config.apiBaseUrl}/votes/get-receivers`, {}, reqOpts);
      if (resObj && resObj.data.Items) {
        //let groupObj = { ...groups };// set a new object to replace groups
        // unescape the topic if it was escaped
        let receivers = resObj.data.Items.map((itm) => {
          return itm
        });

        return receivers;
      }

      //}

    } catch (err) {
      return;
    }
  }

  const checkComments = async (topics) => {
    try {

      if (!topics) {
        return;
      }
      let checkedTopics = [];// to hold array of promises 
      // create promises for each 
      let topicCount = 0;

      while (topicCount < topics.length) {
        let itm = topics[topicCount];
        let hasCompleted = await checkComment(itm.groupId, itm.topicId);
        if (hasCompleted && hasCompleted.groupId) {

          itm.hasCommented = hasCompleted.hasCommented;
        }
        checkedTopics.push(itm);
        topicCount += 1;
      }

      return checkedTopics;
    } catch (err) {
      console.log('no topics ')
    }
  }

  const checkComment = async (groupId, topicId) => {
    if (!groupId || !topicId) {
      return;
    }
    try {
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
        groupId: groupId,
        topicId: topicId,
      }, reqOpts);

      if (resObj && resObj.data) {
        return resObj.data;
      } else {
        return {};
      }

    } catch (err) {
      return {};
    }
  }

  // sends the comment to be posted 
  const sendComment = async (comment) => {
    let groupId = groups[currentGroup].gsid;
    let topicId = currentTopic.topicId;
    if (!groupId || !topicId || !comment) {
      return;
    }
    try {
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
        groupId: groupId,
        topicId: topicId,
        comment: comment
      }, reqOpts);

      if (resObj && resObj.status === 200) {
        setAlertType('success');
        setAlertTitle('Success!');
        setAlertMsg(reason.success);
      } else {
        setAlertType('danger');
        setAlertTitle('Voter already commented');
        setAlertMsg(reason.duplicate);
      }

      setTryComment(false);
      setShow(true);

      let topicGroups = {...groups}
      let topicGroup = topicGroups[currentGroup];
      let groupWithTopics = await getTopics(topicGroup,receivers);
      topicGroups[currentGroup].topics = groupWithTopics;
      setGroups(topicGroups);

    } catch (err) {
      setAlertType('danger');
      setAlertTitle('Error');
      setAlertMsg(reason.error);
      setTryComment(false);
      setShow(true);
    }
  }

  // takes the string representation of the tags
  // breaks them up and turns them into links
  const createTags = (tags,topicReceivers) => {

    let tagsArr = [];
    // create a map of the receivers to get their level

    try {
      let receiverMap = {}
      if (topicReceivers && topicReceivers.length) {
        topicReceivers.map((itm, ind) => {
          receiverMap[itm.receiverId.S] = itm.level.S;
        });
      }
      let tagsColl = tags.split("|");
      tagsColl.map((itm, ind) => {
        let tag = itm.split("-");
        let tagId = tag[0];
        let lastname = tag[1];
        let receiverLevel = receiverMap[tagId];
        if (tagId) {
          tagsArr.push({ receiverId: tagId, lastname: lastname, level: receiverLevel });
        }
      });
    } catch (err) {
      return [];
    }
    return tagsArr;
  }

  const getReceiver = (tag) => {
    try {
      let receiver = {};
      receivers.map((itm, ind) => {
        if (itm.receiverId.S === tag) {
          if (itm && itm.website && itm.website.S) {
            itm.website.S = unescape(itm.website.S);
          }
          if (itm && itm.social && itm.social.S) {
            itm.social.S = unescape(itm.social.S);
          }


          receiver = itm;
        }
      })
      if (receiver) {
        setCurrentReceiver(receiver);
      }

    } catch (err) {
      console.error("Couldn't set receiver");
    }

  }

  return (<Container fluid="md">
    <h2>Conduit <img src="../conduit.png" className='conduit-title' alt="conduit" title="conduit" /></h2>
    <p>Conduit is a service that allows you to make a comment on a specific topic. Your comment goes directly to a feed that we publish specifically for your elected officials, candidates and public officials.</p>
    <hr></hr>
    <Row>

      {show ? (
        <Col lg={6} xs={12}>
          <ToastContainer position='middle-center'>
            <Toast className='conduit-toast' bg={alertType} onClose={() => setShow(false)} show={show} delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">{alertTitle}</strong>
              </Toast.Header>
              <Toast.Body>
                  <div className='conduit-toast-message'>{alertMsg}</div>
                  <div className='conduit-toast-action'>{alertType === "success" ? (<img src="../star.svg" title="success!" alt="success" />):(<img src="../exclamation-triangle-red.svg" title="error!" alt="error" />)}</div>
              </Toast.Body>
          </Toast>
          </ToastContainer>
        </Col>
      ) : (<></>)}
    </Row>
    {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>) : (

  
        <Tab.Container defaultActiveKey="Local" onSelect={async (e) => {
        let groupName = e;
        setCurrentGroup(groupName);
        //let group = groups[groupName] || "";
        // if (group && group.hasOwnProperty('topics') === false) {
        //   await getTopics(groupName);
        // }
        // let newTopics = groups[groupName].topics;
        // console.log('new topics: ',newTopics);
        // setCurrentTopics(newTopics);
        return;

      }}>
          <Row>
              <Nav variant='tabs' defaultActiveKey={"/Local"}>
                <Nav.Item>
                  <Nav.Link eventKey="Local">Local<div className='nav-indicator local'></div></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="State">State<div className='nav-indicator state'></div></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="National">National<div className='nav-indicator national'></div></Nav.Link>
                </Nav.Item>
              </Nav>
          </Row>
          <Row>
            <Col sm={12}>
              <Tab.Content>
                {(loading === false && groups) ? Object.keys(groups).map((itm, ind) => {
                  return (
                    <Tab.Pane eventKey={itm} key={`${ind}-pane`}>
                      <Col lg={6} xs={12}><p>Description: {groups[itm].description}</p>
                      {itm === 'State' || itm === 'National' ? ( <div className='limit-notice'><p>U-Vote is currntly testing <strong>local</strong> issues. Issues are here to show <strong>state</strong> and <strong>national</strong> capability. </p></div>) : (<></>)}
                      </Col>
                      <h4 className='mt-1'>{groups[itm].title}  <img src={`../${groups[itm].name}.png`} alt={groups[itm].name} title={groups[itm].name} className='table-group-img'></img></h4>
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
                              {currentTopics && Array.isArray(currentTopics) ? currentTopics.map((itm, ind) => {
                                return (
                                  <tr key={ind} className={itm.hasCommented ? 'vote-completed' : ''}>
                                    <td key={`${ind}-info`} className='table-info-col'>
                                      <div className='topic'>{itm.topic}</div>
                                      <div className='tags'>Receivers: {itm.tags && Array.isArray(itm.tags) ? (itm.tags.map((itm, ind) => {
                                        return (<>{ind && ind > 0 ? (" ") : (<></>)}<Button key={ind} className={'conduit-receivers'} value={itm.receiverId} onClick={(e) => {
                                          getReceiver(e.currentTarget.value);
                                          setTryReceiver(true);
                                        }}><div className='conduit-receiver-label'>{itm.lastname}</div> <div className={`nav-indicator ${itm && itm.level ? itm.level : ''}`}></div> </Button> </>);
                                      })) : (<></>)}</div>
                                    </td>
                                    <td key={`${ind}-link`} className='table-link-col'>{itm.hasCommented ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Commented</Tooltip>}><div className='vote-buttons vote-completed-img'><img src='../check-square.svg' alt='vote completed' title='vote completed'></img><div>Done</div></div></OverlayTrigger>) : (
                                      <Button className='vote-buttons' variant='primary' onClick={(e) => {
                                        let topic = itm;
                                        setCurrentTopic(topic);
                                        setTryComment(true);
                                      }}><img src='../chat-quote.svg' className='button-icon' alt='comment on this issue' title='comment on this issue' /><div>Comment</div></Button>
                                    )}</td>
                                  </tr>
                                )
                              }
                              ) : (<div>No topics yet</div>)
                              }
                            </tbody>
                          </Table>
                        </>
                      ) : (<div>No topics yet</div>)}
                    </Tab.Pane>)
                }) : (<></>)}
              </Tab.Content>
            </Col>
          </Row>


        </Tab.Container>
    )}
   {tryComment && currentTopic ? (<Comment show={tryComment} hide={setTryComment} send={sendComment} topic={currentTopic.topic}></Comment>) : ("")}
  {tryReceiver && currentReceiver ? (<Receiver show={tryReceiver} hide={setTryReceiver} receiver={currentReceiver}></Receiver>) : ("")}
  </Container>)


}

export default Conduit;

