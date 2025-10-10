import './App.css';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Button, Container, Row, Col,  Nav, OverlayTrigger, Table, Tab,  } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';

function Feeds() {
    const [groups, setGroups] = useState({});
    const [loading, setLoading] = useState(false);
    const [groupsSet, setGroupsSet] = useState(false);
    const [currentGroup, setCurrentGroup] = useState("Local");
    const [currentFeeds, setCurrentFeeds] = useState([]);

    const navigate = useNavigate();

    // get the set of groups if not already there
  useEffect(() => {
    setLoading(true);      

    const checkFeeds = async (feedGroups) => {
      try{
          if(feedGroups && feedGroups.Local && feedGroups.State && feedGroups.National){
            let localFeeds = await getFeeds(feedGroups["Local"]);
            let stateFeeds = await getFeeds(feedGroups["State"]);
            let nationalFeeds = await getFeeds(feedGroups["National"]);
            let newGroups = {...feedGroups};
            newGroups["Local"].feeds = localFeeds;
            newGroups["State"].feeds = stateFeeds;
            newGroups["National"].feeds = nationalFeeds;
            return newGroups;
          }
          let noGroups = {...feedGroups}
          noGroups["Local"].feeds = [];
          noGroups["State"].feeds = [];
          noGroups["National"].feeds = [];
          return noGroups; 
      }catch(err){
        let errorGroups = {...feedGroups}
        errorGroups["Local"].feeds = [];
        errorGroups["State"].feeds = [];
        errorGroups["National"].feeds = [];
        return errorGroups; 
      }
    }


    const checkGroups = async () => {

      let feedGroups = {
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
              feedGroups.State = checkGroups.data[key];
            }
            if (key === 'city') {
              feedGroups.Local = checkGroups.data[key];
            }
            if (key === 'national') {
              feedGroups.National = checkGroups.data[key];
            }
          }
          )
        }
        
        setCurrentGroup("Local");
        let allFeedsGroups = await checkFeeds(feedGroups);
        setGroups(allFeedsGroups);
        setCurrentGroup('Local');
        let currentFeeds = allFeedsGroups['Local'].feeds;
        setCurrentFeeds(currentFeeds);
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

  const getFeeds = async (group) => {
    try {

        if(!group){
          return [];
        }
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

      let payload = {
        groupId: group.gsid
      }

      const resObj = await axios.post(`${config.apiBaseUrl}/feeds`, payload, reqOpts);
      return resObj.data;
    } catch (err) {
      return [];
    }
  }

    useEffect(()=>{
      let newFeeds = groups[currentGroup] && groups[currentGroup].feeds || [];
      console.log('new feeds: ', newFeeds);
      setCurrentFeeds(newFeeds);
    },[currentGroup,groups])


    return (<Container>
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
                      
                    </Tab.Pane>)
                }) : (<></>)}
              </Tab.Content>
            </Col>
          </Row>


        </Tab.Container>
    </Container>)
}

export default Feeds;