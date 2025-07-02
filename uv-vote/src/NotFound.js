import './App.css';
import { Button, Container, Row, Col} from "react-bootstrap";

function NotFound(){

    return (
        <Container className='not-found'>
            <Row>
                <Col lg={{offset:4,span:4}}>
                <div className='not-found-img-holder'>
                    <img src="404.png" />
                </div>
                </Col>
            </Row>
            <Row>
                <h4>404 Not Found</h4>
                <p>return <a href="/" alt="U-Vote home">home</a> to access your votes and other voter tools.</p>
            </Row>
        </Container>
    );
}

export default NotFound;