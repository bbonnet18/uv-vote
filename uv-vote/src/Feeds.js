import './App.css';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Badge, Button, Container, Row, Col, Nav, OverlayTrigger, Spinner, Tooltip, Table, Tab, } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Feed from './Feed';
import cookies from './cookies';
import config from './config';
import Receiver from './Receiver';
import unescape from 'validator/lib/unescape';

function Feeds() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
  const [groupsSet, setGroupsSet] = useState(false);
  const [currentGroup, setCurrentGroup] = useState("Local");
  const [currentFeeds, setCurrentFeeds] = useState([]);
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [tryReceiver, setTryReceiver] = useState(false);
  const [feedsViewed, setFeedsViewed] = useState({});
  const [loadingIds, setLoadingIds] = useState({});

  const navigate = useNavigate();

  // get the set of groups if not already there
  useEffect(() => {
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


    // const checkGroups = async () => {

    //   let feedGroups = {
    //     Local: {},
    //     State: {},
    //     National: {}

    //   };

    //   setLoading(true)
    //   try {
    //     let checkGroups = await getGroups();
    //     if (checkGroups) {
    //       let keys = Object.keys(checkGroups.data);
    //       keys.map((key) => {
    //         if (key === 'state') {
    //           feedGroups.State = checkGroups.data[key];
    //         }
    //         if (key === 'city') {
    //           feedGroups.Local = checkGroups.data[key];
    //         }
    //         if (key === 'national') {
    //           feedGroups.National = checkGroups.data[key];
    //         }
    //       }
    //       )
    //     }

    //     setCurrentGroup("Local");
    //     let feedReceivers = await getReceivers();
    //     let allFeedsGroups = await checkFeeds(feedGroups, feedReceivers);
    //     setGroups(allFeedsGroups);
    //     setCurrentGroup('Local');
    //     setReceivers(feedReceivers);
    //     let currentFeeds = allFeedsGroups['Local'].feeds;
    //     setCurrentFeeds(currentFeeds);
    //     setLoading(false);
    //   } catch (err) {
    //     setLoading(false);
    //   }

    //   setLoading(false);
    // }

    // if(groupsSet === false){
    //   checkGroups();
    //   setGroupsSet(true);
    // }


  }, []);

  //   const getGroups = async () => {

  //   try {

  //     // get the JWT to use for auth
  //     const authCookie = cookies.getCookie('voterToken') || "";
  //     if (authCookie === "") {

  //       navigate('/validate');
  //     }
  //     // get the cookie and set the auth header
  //     const reqOpts = {
  //       headers: {
  //         "Authorization": `Bearer ${authCookie}`
  //       },
  //       withCredentials: true
  //     }

  //     const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-groups`, {}, reqOpts);
  //     return resObj;
  //   } catch (err) {
  //     return {};
  //   }

  // }

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

  useEffect(() => {
    let newFeeds = groups[currentGroup] && groups[currentGroup].feeds || [];
    setCurrentFeeds(newFeeds);
  }, [currentGroup, groups])

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
  const setFeedViewed = (groupId, topicId) => {
    if (!feedsViewed[`${groupId}-${topicId}`]) {
      setFeedsViewed(prevState => ({ ...prevState, [`${groupId}-${topicId}`]: true }));
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

  return (<Container>
    {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>) : (<Tab.Container defaultActiveKey="Local" onSelect={async (e) => {
      let groupName = e;
      setCurrentGroup(groupName);
      return;

    }}>
      <Row>

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
                  {currentFeeds ? (
                    <>
                      <Table key={ind} striped bordered hover>
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
                                  <div className='tags'>Receivers: {itm.tags && Array.isArray(itm.tags) ? (itm.tags.map((itm, ind) => {
                                    return (<>{ind && ind > 0 ? (" ") : (<></>)}<Button key={ind} className={'conduit-receivers'} value={itm.receiverId} onClick={(e) => {
                                      getReceiver(e.currentTarget.value);
                                      setTryReceiver(true);
                                    }}><div className='conduit-receiver-label'>{itm.lastname}</div> <div className={`nav-indicator ${itm && itm.level ? itm.level : ''}`}></div> </Button> </>);
                                  })) : (<></>)}</div>
                                  <div>{feedsViewed[`${itm.groupId}-${itm.topicId}`] ? (<div><Feed groupId={itm.groupId} topicId={itm.topicId}></Feed></div>) : (<></>)}</div>
                                </td>
                                <td key={`${ind}-link`} className='table-link-col'>{itm && itm.surveyId ? (loadingIds && loadingIds[itm.surveyId] ? ( <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>):(itm.voteLink && itm.voteLink !== 'completed' ?(<Button className="vote-buttons" variant="success" onClick={(e)=>{
                      if(itm && itm.voteLink){
                        window.location=itm.voteLink;
                      }
                    }}><img src='../play-fill.svg' className='button-icon' alt='vote on this issue' title='vote on this issue' /><div>Vote</div></Button>):(itm.voteLink === 'completed' ? (<OverlayTrigger overlay={<Tooltip id={`tooltip${ind}`}>You Voted</Tooltip>}><div className='vote-buttons vote-completed-img'><img src='../check-square.svg' alt='vote completed' title='vote completed'></img><div>Done</div></div></OverlayTrigger>):(<Button className="vote-buttons" variant="primary" onClick={(e)=>{
                      e.preventDefault();
                      let myLid = {...loadingIds};
                      myLid[itm.surveyId] = 'loading';
                      setLoadingIds(myLid)
                      registerToVote(itm.surveyId)}
                    } alt='click or tap to register' title='click or tap to register' ><img src='../play-empty.svg' className='button-icon' alt='register for this issue' title='register for this issue' /><div>Start</div></Button>))) ): (<></>)}</td>
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
    {tryReceiver && currentReceiver ? (<Receiver show={tryReceiver} hide={setTryReceiver} receiver={currentReceiver}></Receiver>) : ("")}
  </Container>)
}

export default Feeds;