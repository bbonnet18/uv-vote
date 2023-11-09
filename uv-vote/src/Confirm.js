import './App.css';
import { Col, Row, Button, Container} from "react-bootstrap";
import { NavLink } from 'react-router-dom';

function Confirm() {



return(
<Container fluid="md" className='mt-2'>
    <p className='confirm-txt'>Registration complete! Your registration will be validated and you will receive your voter key within ~24 hours.</p>
    <Row className="img-preview-wrapper" >
        <Col className='confirm-img' lg={12}>            
        </Col>
    </Row>
    <Row>
        <p className='confirm-txt'>  <NavLink to="/">Check out U-Vote</NavLink></p>
    </Row>

</Container>
)
}

export default Confirm;

