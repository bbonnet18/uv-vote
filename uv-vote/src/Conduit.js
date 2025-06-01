import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Col, Row, Button, Container, Tab, Tabs, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';
import unescape from 'validator/lib/unescape';

function Conduit() {

  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(false);
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
      await getTopics('Local');
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

        const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-topics`, { groupId: groups[group].gsid }, reqOpts);
        if (resObj && resObj.data.Items) {
          let groupObj = { ...groups };// set a new object to replace groups
          // unescape the topic if it was escaped
          groupObj[group].topics = resObj.data.Items.map((itm) => {
            let unescapedTopic = unescape(itm.topic);
            itm.topic = unescapedTopic;
            return itm;
          });
          setGroups(groupObj);
        }
      }

    } catch (err) {
      return;
    }

  }



  return (<Container fluid="md">
    <Tabs onSelect={async (e) => {
      let groupName = e;
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
            <div>Title: {groups[itm].title}</div>
            <div>Description: {groups[itm].description}</div>
            {groups[itm] && groups[itm].topics ? (
              <><div>We have topics:</div>
                <ul>
                  {groups[itm].topics.map((itm, ind) => {
                    return (<li key={ind}>{decodeURIComponent(itm.topic)}</li>)
                  })}
                </ul>
              </>
            ) : (<div>No topics yet</div>)}
          </Tab>
        )
      }) : (<></>)
      }
    </Tabs>
  </Container>)


}

export default Conduit;