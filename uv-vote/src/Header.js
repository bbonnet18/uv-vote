import './App.css';
import { Container } from 'react-bootstrap';
import {useLocation} from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const {pathname} = location;

  return (
    <Container>
      <div class="icon-brand"><div className='container'><a><img src='logo64.webp' ></img></a><div className='alpha-mark'></div></div></div>
    </Container>
  );
}
