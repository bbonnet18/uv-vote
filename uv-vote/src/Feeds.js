import './App.css';
import axios from "axios";
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Badge, Button, Container, Row, Col, Nav, OverlayTrigger, Spinner, Toast, ToastContainer, Tooltip, Table, Tab, } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';
import Feed from './Feed';
import TestComp from './TestComp';
import cookies from './cookies';
import config from './config';
import Receiver from './Receiver';
import unescape from 'validator/lib/unescape';

function Feeds() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentGroup, setCurrentGroup] = useState("Local");
  const [currentFeeds, setCurrentFeeds] = useState([]);
  const [currentFeed, setCurrentFeed] = useState(null);
  const [feedSet, setFeedSet] = useState([]);// holds the feeds that have been selected
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [tryReceiver, setTryReceiver] = useState(false);
  const [tryComment, setTryComment] = useState(false);
  const [currentFeedViewed, setCurrentFeedViewed] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [show, setShow] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Success!')
  const [alertMsg, setAlertMsg] = useState("Thanks for submitting your comment");
  const [alertType, setAlertType] = useState('success');

  const reason = {
    'success': 'Your comment was created successfully.',
    'error': 'There was an error creating your comment, please try again.',
    'duplicate': 'We already have a comment from this voter on this topic.'
  }


  const navigate = useNavigate();

  // get the set of groups if not already there
  useEffect(() => {
    console.log('RERENDERING ---- ')
    setLoading(true);
    const checkFeeds = async () => {
      try {
        let feedReceivers = await getReceivers();
        setReceivers(feedReceivers);
        let newGroups = {
          Local: {},
          State: {},
          National: {}
        };
        let allFeeds = await getFeeds(feedReceivers);
        if (allFeeds && allFeeds.feeds) {
          let voterFeeds = { ...allFeeds.feeds };
          newGroups["Local"].feeds = voterFeeds.city.feeds;
          newGroups["Local"].name = voterFeeds.city.name
          newGroups["State"].feeds = voterFeeds.state.feeds;
          newGroups["State"].name = voterFeeds.state.name
          newGroups["National"].feeds = voterFeeds.national.feeds;
          newGroups["National"].name = voterFeeds.national.name
        } else {

          newGroups["Local"].feeds = [];
          newGroups["State"].feeds = [];
          newGroups["National"].feeds = [];
        }
        setGroups(newGroups);
        setCurrentGroup('Local');
        let currentFeeds = newGroups['Local'].feeds;
        setCurrentFeeds(currentFeeds);
      } catch (err) {
        let errorGroups = {}
        errorGroups["Local"].feeds = [];
        errorGroups["State"].feeds = [];
        errorGroups["National"].feeds = [];
        setReceivers([]);
        setGroups(errorGroups);
      }
      setLoading(false);

    }

    try {
      checkFeeds();
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }



  }, []);


  useEffect(() => {
    let newFeeds = groups[currentGroup] && groups[currentGroup].feeds || [];
    setCurrentFeeds(newFeeds);
  }, [currentGroup, groups])





  const getFeeds = async (feedReceivers) => {
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


      const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-feeds`, {}, reqOpts);
      if (resObj && resObj.data.feeds) {

        // unescape the topic if it was escaped and fix the tags
        let feedKeys = Object.keys(resObj.data.feeds);
        feedKeys.forEach((itm) => {
          resObj.data.feeds[itm].feeds.map((itm) => {
            let unescapedTitle = unescape(itm.title);
            itm.title = unescapedTitle;
            itm.tags = createTags(itm.tags, feedReceivers);
            return itm;
          });

        });

        return resObj.data;
      }
    } catch (err) {
      return [];
    }
  }

  const getFeed = async (groupId, topicId) => {

    let feedSelected = feedSet.find((itm) => itm && itm.feed && itm.feed.groupId == groupId && itm.feed.topicId == topicId);
    if (feedSelected) {
      return feedSelected;
    }
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
      //setLoading(true);
      let payload = {
        groupId: groupId,
        topicId: topicId
      }
      const resObj = await axios.post(`${config.apiBaseUrl}/votes/get-feed`, payload, reqOpts);
      let newFeed = resObj.data;
      let newFeedSet = [...feedSet];
      newFeedSet.push(newFeed);
      setFeedSet(newFeedSet);
      //setLoading(false);
      return newFeed;
    } catch (error) {
      console.error("Error fetching feed:", error);
      //setLoading(false);
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


  const checkComments = async (currentFeeds) => {
    try {

      if (!currentFeeds) {
        return;
      }
      let checkedTopics = [];// to hold array of promises 
      // create promises for each 
      let feedCount = 0;

      while (feedCount < currentFeeds.length) {
        let itm = currentFeeds[feedCount];
        let hasCompleted = await checkComment(itm.groupId, itm.topicId);
        if (hasCompleted && hasCompleted.groupId) {

          itm.hasCommented = hasCompleted.hasCommented;
        }
        checkedTopics.push(itm);
        feedCount += 1;
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
    let groupId = currentFeed.groupId;
    let topicId = currentFeed.topicId;
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
        let feedGroups = { ...groups }
        let myFeeds = feedGroups[currentGroup].feeds;
        let status = resObj.data.status;
        //add the survey link for the newly registered item
        if (resObj.data) {
          myFeeds = myFeeds.map((itm) => {
            if (itm.groupId == groupId & itm.topicId == topicId) {
              itm.hasCommented = status && status === 'created';
            }
            return itm;
          })
          setCurrentFeeds(myFeeds);
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

      }

    } catch (err) {
      setAlertType('danger');
      setAlertTitle('Error');
      setAlertMsg(reason.error);
      setTryComment(false);
      setShow(true);
    }
  }


  // useEffect(() => {
  //   console.log('feeds viewed updated: ', feedsViewed);
  // }, [feedsViewed])
  // takes the string representation of the tags
  // breaks them up and turns them into links
  const createTags = (tags, feedReceivers) => {

    let tagsArr = [];
    // create a map of the receivers to get their level

    try {
      let receiverMap = {}
      if (feedReceivers && feedReceivers.length) {
        feedReceivers.map((itm, ind) => {
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
  // sets if a feed has been viewed so it doesn't reload it
  // const setFeedViewed = (groupId, topicId) => {
  //   let viewed = { ...feedsViewed };
  //   let currVal = viewed[`${groupId}-${topicId}`];
  //   viewed[`${groupId}-${topicId}`] = !currVal;

  //   //setFeedsViewed(prevState => ({ ...prevState, [`${groupId}-${topicId}`]: true }));
  //   //setFeedsViewed(viewed);
  //   //console.log(viewed); 
  // }


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
        let myFeeds = [...currentFeeds]
        //add the survey link for the newly registered item
        myFeeds = myFeeds.map((itm) => {
          if (itm.surveyId == surveyId) {
            itm.voteLink = resObj.data.surveyLink;
          }
          return itm;
        })

        setLoadingIds({});
        setCurrentFeeds(myFeeds);
      } else {
        setLoadingIds({});
      }

    } catch (err) {
      //setValidVoter(false);
      setLoadingIds({});
    }

  }

  return (<Container className="feeds-container">
    {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>) : (<Tab.Container defaultActiveKey="Local" onSelect={async (e) => {
      let groupName = e;
      setCurrentGroup(groupName);
      return;

    }}>
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
                  <div className='conduit-toast-action'>{alertType === "success" ? (<img src="../star.svg" title="success!" alt="success" />) : (<img src="../exclamation-triangle-red.svg" title="error!" alt="error" />)}</div>
                </Toast.Body>
              </Toast>
            </ToastContainer>
          </Col>
        ) : (<></>)}
      </Row>
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
                    {itm === 'State' || itm === 'National' ? (<div className='limit-notice'><p>U-Vote is currntly testing <strong>local</strong> issues. Issues are here to show <strong>state</strong> and <strong>national</strong> capability. </p></div>) : (<></>)}
                  </Col>
                  <h4 className='mt-1'>{groups[itm].title} <img src={`../${groups[itm].name}.png`} alt={groups[itm].name} title={groups[itm].name} className='table-group-img'></img></h4>
                  {currentFeeds && currentFeeds.length ? (
                    <>
                      <Table className='feeds-table' key={ind} striped bordered hover>
                        <thead>
                          <tr>
                            <th>Feeds</th>
                            <th className='table-link-col'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFeeds && Array.isArray(currentFeeds) ? currentFeeds.map((itm, ind) => {
                            return (
                              <tr key={ind}>
                                <td key={`${ind}-info`} className='table-info-col'>
                                  <div className='title'>{itm.title}</div>
                                  <div className='tags'>Receivers: <div className="receivers-action"></div> <div className='receivers'>{itm.tags && Array.isArray(itm.tags) ? (itm.tags.map((itm, ind) => {
                                    return (<>{ind && ind > 0 ? (" ") : (<></>)}<Button key={ind} className={'conduit-receivers'} value={itm.receiverId} onClick={(e) => {
                                      getReceiver(e.currentTarget.value);
                                      setTryReceiver(true);
                                    }}><div className='conduit-receiver-label'>{itm.lastname}</div> <div className={`nav-indicator ${itm && itm.level ? itm.level : ''}`}></div> </Button> </>);
                                  })) : (<></>)}</div></div>
                                   <div className='table-row-buttons'><div className='feed-action'>{itm.hasCommented ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Commented</Tooltip>}><div className='vote-buttons completed'><img className='button-icon' src='../check-square.svg' alt='vote completed' title='vote completed'></img><div className='label'>Done</div></div></OverlayTrigger>) : (
                                    <Button className='vote-buttons' variant='primary' onClick={(e) => {
                                      let topic = itm;
                                      setCurrentFeed(itm);
                                      setTryComment(true);
                                    }}><img src='../chat-quote.svg' className='button-icon' alt='comment on this issue' title='comment on this issue' /><div className='label'>Comment</div></Button>
                                  )}</div><div className='feed-action'>{itm && itm.surveyId ? (loadingIds && loadingIds[itm.surveyId] ? (<Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </Spinner>) : (itm.voteLink && itm.voteLink !== 'completed' ? (<Button className="vote-buttons" variant="success" onClick={(e) => {
                                    if (itm && itm.voteLink) {
                                      window.location = itm.voteLink;
                                    }
                                  }}><img src='../play-fill.svg' className='button-icon' alt='vote on this issue' title='vote on this issue' /><div className='label'>Vote</div></Button>) : (itm.voteLink === 'completed' ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Voted</Tooltip>}><div className='vote-buttons completed'><img className='button-icon' src='../check-square.svg' alt='vote completed' title='vote completed'></img><div className='label'>Done</div></div></OverlayTrigger>) : (<Button className="vote-buttons" variant="primary" onClick={(e) => {
                                    e.preventDefault();
                                    let myLid = { ...loadingIds };
                                    myLid[itm.surveyId] = 'loading';
                                    setLoadingIds(myLid)
                                    registerToVote(itm.surveyId)
                                  }
                                  } alt='click or tap to register' title='click or tap to register' ><img src='../play-empty.svg' className='button-icon' alt='register for this issue' title='register for this issue' /><div className='label'>Start</div></Button>)))) : (<></>)}</div>
                                    <div className='feed-action'><div className=''><Button className='vote-buttons' variant='primary' key={ind} onClick={async () => {
                                      let selectedFeed = await getFeed(itm.groupId, itm.topicId);
                                      setCurrentFeedViewed(selectedFeed);
                                      // setFeedViewed(itm.groupId, itm.topicId); 
                                    }}><img src='../bar-chart-fill.svg' className='button-icon' alt='register for this issue' title='register for this issue' /><div className='label'>Data</div></Button></div></div>
                                  </div>
                                  <div>{currentFeedViewed && currentFeedViewed.feed ?
                                    (currentFeedViewed.feed.groupId === itm.groupId && currentFeedViewed.feed.topicId === itm.topicId ? (<div><Feed feed={currentFeedViewed} /></div>) : (<></>)) : (<></>)
                                  }
                                  </div>
                                </td>
                                <td key={`${ind}-link`} className='table-link-col feeds-table'><div className='feed-action'>{itm.hasCommented ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Commented</Tooltip>}><div className='vote-buttons completed'><img className='button-icon' src='../check-square.svg' alt='vote completed' title='vote completed'></img><div className='label'>Done</div></div></OverlayTrigger>) : (
                                  <Button className='vote-buttons' variant='primary' onClick={(e) => {
                                    let topic = itm;
                                    setCurrentFeed(itm);
                                    setTryComment(true);
                                  }}><img src='../chat-quote.svg' className='button-icon' alt='comment on this issue' title='comment on this issue' /><div className='label'>Comment</div></Button>
                                )}</div><div className='feed-action'>{itm && itm.surveyId ? (loadingIds && loadingIds[itm.surveyId] ? (<Spinner animation="border" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </Spinner>) : (itm.voteLink && itm.voteLink !== 'completed' ? (<Button className="vote-buttons" variant="success" onClick={(e) => {
                                  if (itm && itm.voteLink) {
                                    window.location = itm.voteLink;
                                  }
                                }}><img src='../play-fill.svg' className='button-icon' alt='vote on this issue' title='vote on this issue' /><div className='label'>Vote</div></Button>) : (itm.voteLink === 'completed' ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Voted</Tooltip>}><div className='vote-buttons completed'><img className='button-icon' src='../check-square.svg' alt='vote completed' title='vote completed'></img><div className='label'>Done</div></div></OverlayTrigger>) : (<Button className="vote-buttons" variant="primary" onClick={(e) => {
                                  e.preventDefault();
                                  let myLid = { ...loadingIds };
                                  myLid[itm.surveyId] = 'loading';
                                  setLoadingIds(myLid)
                                  registerToVote(itm.surveyId)
                                }
                                } alt='click or tap to register' title='click or tap to register' ><img src='../play-empty.svg' className='button-icon' alt='register for this issue' title='register for this issue' /><div className='label'>Start</div></Button>)))) : (<></>)}</div>
                                  <div className='feed-action'><div className=''><Button className='vote-buttons' variant='primary' key={ind} onClick={async () => {
                                    let selectedFeed = await getFeed(itm.groupId, itm.topicId);
                                    setCurrentFeedViewed(selectedFeed);
                                    // setFeedViewed(itm.groupId, itm.topicId); 
                                  }}><img src='../bar-chart-fill.svg' className='button-icon' alt='register for this issue' title='register for this issue' /><div className='label'>Data</div></Button></div></div></td>
                              </tr>
                            )
                          }
                          ) : (<tr><td colSpan="2"><div>No feeds yet</div></td></tr>)
                          }
                        </tbody>
                      </Table>
                    </>
                  ) : (<div>No feeds yet</div>)}
                </Tab.Pane>)
            }) : (<></>)}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>)}
    {tryComment && currentFeed ? (<Comment show={tryComment} hide={setTryComment} send={sendComment} topic={currentFeed.title}></Comment>) : ("")}
    {tryReceiver && currentReceiver ? (<Receiver show={tryReceiver} hide={setTryReceiver} receiver={currentReceiver}></Receiver>) : ("")}
  </Container>)
}

export default Feeds;