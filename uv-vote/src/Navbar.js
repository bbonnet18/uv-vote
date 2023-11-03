import './App.css';
import { Nav } from 'react-bootstrap';
import {useState,useEffect} from "react";
import {useLocation} from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const {pathname} = location;

    // useEffect(()=>{
    //     console.log('key: ',key);
    // })
    console.log('pathname: ',pathname);

  return (
    <Nav variant='underline' activeKey={pathname.substring(1)}
    onSelect={(selectedKey) => {
        //setKey(selectedKey); 
        console.log('selected key: ',selectedKey)

    }}>
        <Nav.Item>
            <Nav.Link eventKey="" href="/">Home</Nav.Link>
        </Nav.Item>
         <Nav.Item>
            <Nav.Link eventKey="votes" href="/votes">Your Votes</Nav.Link>
        </Nav.Item>
        <Nav.Item >
            <Nav.Link eventKey="getkey"  href="/getkey">Get a voter key</Nav.Link>
        </Nav.Item>
    </Nav>
  );
}
