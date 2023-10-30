import './App.css';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import {useState,useEffect} from "react";

export default function Navbar() {

    const [key, setKey] = useState('/home');
    useEffect(()=>{
        console.log('key: ',key);
    },[key])

  return (
    <Nav variant='underline' activeKey={key} 
    onSelect={(selectedKey) => {
        setKey(selectedKey); 
        console.log('selected key: ',selectedKey)
        console.log('activeKey: ',key)
    }}>
         <Nav.Item>
            <Nav.Link eventKey="home" href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item >
            <Nav.Link eventKey="getkey"  href="/getkey">Get a voter key</Nav.Link>
        </Nav.Item>
    </Nav>
  );
}
