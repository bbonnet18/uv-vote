import './App.css';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import cookies from './cookies';
import CookieNotice from './CookieNotice';
import Countdown from './Countdown';

export default function App() {

  const [agreeCookies,setAgreeCookies] = useState(true);

  useEffect(()=>{

    let agreeCookie = cookies.getCookie('accepts');
    if(!agreeCookie){
      setAgreeCookies(false);
    }

  },[agreeCookies]);

  const setUserAgree = (cname,cval)=> {
      cookies.setCookie(cname,cval);
      setAgreeCookies(true);
  }


  return (
    <>
    <div className="icon-brand"><div className='container'><img src='logo64.webp' alt="U-Vote" title="U-Vote" className='header-img'></img>U-Vote<div className='alpha-mark'>BETA</div><Countdown /></div></div>
    <hr className='nav-sep'></hr>
    
    <Container className='p-0'>
      <Container className='top-nav'>
      <Navbar></Navbar>
      </Container>
    <Outlet />
    </Container>
    {agreeCookies ? (<></>):(<CookieNotice setAgree={setUserAgree}></CookieNotice>)}
    </>
  );
}