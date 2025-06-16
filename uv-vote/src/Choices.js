import './App.css';
import { NavLink } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

function Choices() {

    return (
        <Container className='choices'>
            <Row>
                <Col lg={3} xs={12} className='mt-2'>
                    <Card className='conduit' >
                        <Card.Img className="conduit-img" variant="top" src="conduit.png" />
                        <Card.Body>
                            <Card.Title>Conduit</Card.Title>
                            <Card.Text>
                                Conduit let's you say what on your mind about a variety of issues. 
                            </Card.Text>
                            <NavLink to="/actions/conduit">Check out Conduit</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} xs={12} className='mt-2'>
                <Card className='conduit' >
                        <Card.Img className="conduit-img" variant="top" src="connect.png" />
                        <Card.Body>
                            <Card.Title>Connect</Card.Title>
                            <Card.Text>
                                Connect with others 
                            </Card.Text>
                            <NavLink to="/actions/conduit">Learn more</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} xs={12} className='mt-2'>
                <Card className='conduit' >
                        <Card.Img className="conduit-img" variant="top" src="solutions.png" />
                        <Card.Body>
                            <Card.Title>U-Vote Solutions Teams</Card.Title>
                            <Card.Text>
                                Connect with others so we can solve problems 
                            </Card.Text>
                            <NavLink to="/actions/conduit">Learn more</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )

}

export default Choices; 