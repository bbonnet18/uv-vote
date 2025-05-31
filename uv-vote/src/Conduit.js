import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Col, Row, Button, Container, Tab, Tabs, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';

function Conduit(){

  const [groups,setGroups] = useState({});
  const [loading,setLoading] = useState(false);
  // get the set of groups if not already there
  useEffect(()=>{
    setLoading(true);
    const checkGroups = async ()=>{

      let conduitGroups = {
        Local:{},
        State:{},
        National:{}

      };

        setLoading(true)
        let checkGroups = await getGroups();
        if(checkGroups){
          let keys = Object.keys(checkGroups.data);
          keys.map((key)=>{
            if(key === 'state'){
              conduitGroups.State = checkGroups.data[key];
            }
            if(key === 'city'){
              conduitGroups.Local = checkGroups.data[key];
            }
            if(key === 'national'){
              conduitGroups.National = checkGroups.data[key];
            }
          }
        )
        }
        setGroups(conduitGroups)
        setLoading(false);
    } 

       checkGroups();
   
  },[]);

    const navigate = useNavigate();

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
    }catch(err){
        return {}; 
    }

}


const getTopics = async () => {

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
    
        const resObj = await axios.post(`${config.apiBaseUrl}/votes/my-topics`, {groupId:10}, reqOpts);
        return resObj;
    }catch(err){
        return {}; 
    }

}



return (<Container fluid="md">
        <Tabs onSelect={(e)=>{
          console.log('changed: ',e);
        }}>
        {loading ? (<Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner>) : (<></>)}
          {(loading === false && groups) ? Object.keys(groups).map((itm,ind)=>{
           return (
              <Tab eventKey={itm} title={itm} key={ind}>
                <div>Title: {groups[itm].title}</div>  
                <div>Description: {groups[itm].description}</div>  
              </Tab>
           )
          }) : (<></>)
        }
        </Tabs>
        <Button variant='success' onClick={async()=>await getGroups()}>Check Groups</Button>
        <Button variant='success' onClick={async()=>await getTopics()}>Check Topics</Button>
    </Container>)


}

export default Conduit;