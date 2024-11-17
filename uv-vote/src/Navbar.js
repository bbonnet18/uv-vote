import './App.css';
import { Nav } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const { pathname } = location;
  // const navigate = useNavigate();

  const [hasKey, setHasKey] = useState(false);
  useEffect(() => {

    let hasKey = getCookie('voterToken');
    if (hasKey) {
      setHasKey(true);
    }


  })

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  return (
    <Nav variant='underline' activeKey={pathname.substring(1)}
      onSelect={(selectedKey) => {
        //setKey(selectedKey); 

      }}>
      <Nav.Item>
        <Nav.Link eventKey="" href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="votes" href="/votes">Your Votes</Nav.Link>
      </Nav.Item>
      {hasKey ? (<></>) : (
        <Nav.Item >
          <Nav.Link eventKey="getkey" href="/getkey">Get a voter key</Nav.Link>
        </Nav.Item>
      )}
      <Nav.Item>
        <Nav.Link eventKey="faqs" href="/faqs">FAQs</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
