import './App.css';
import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';

export default function Navbar() {

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
      <nav className='nav'>
        <ul>
          <li className='nav-item'><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/votes">Your Votes</NavLink></li>
          {hasKey ? (<></>) : (<li><NavLink to="/getkey">Get a voter key</NavLink></li>)}
          <li><NavLink to="/about">About</NavLink></li>
        </ul>
      </nav>
  )
}
