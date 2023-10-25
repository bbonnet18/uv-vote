import './App.css';
import { Card, Col, Row, Button, Container} from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import config from './config';

function Confirm() {



return(
<Container className='mt-2'>
    <nav>
    <NavLink to="/">Check out U-Vote</NavLink>
        <Button ><img src="key.svg" alt="key" width="30" height="30"></img></Button>
    </nav>
    <p>Registration complete! Your registration will be validated and you will receive your voter key within ~24 hours.</p>
<hr></hr>


</Container>
)
}

export default Confirm;

