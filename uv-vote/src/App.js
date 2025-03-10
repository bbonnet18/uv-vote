import './App.css';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function App() {

  return (
    <>
    <div className="icon-brand"><div className='container'><img src='u-vote-vector-base_70_notext.webp' alt="U-Vote" title="U-Vote" className='header-img'></img>U-Vote<div className='alpha-mark'>BETA</div></div></div>
    <hr className='nav-sep'></hr>
    <Container className='p-0'>
      <Container className='top-nav'>
      <Navbar></Navbar>
      </Container>
    <Outlet />
    </Container>
    </>
  );
}