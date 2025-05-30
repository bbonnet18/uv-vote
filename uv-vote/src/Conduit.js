import './App.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Form, Alert, Col, InputGroup, Row, Button, Link, Container, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';
import config from './config';

function Conduit(){

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



return (<Container>
        <Button variant='success' onClick={async()=>await getGroups()}>Check Groups</Button>
        <Button variant='success' onClick={async()=>await getTopics()}>Check Topics</Button>
    </Container>)


}

export default Conduit;