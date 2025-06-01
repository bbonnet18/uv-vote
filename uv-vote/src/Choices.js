import './App.css';
import { NavLink } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

function Choices() {

    return (
        <Container>
            <Row>
                <Col lg={3} xs={6}>
                    <Card >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Conduit</Card.Title>
                            <Card.Text>
                                Conduit let's you say what on your mind about a variety of issues. 
                            </Card.Text>
                            <NavLink to="/actions/conduit">Check out Conduit</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} xs={6}>
                    <Card >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Connect</Card.Title>
                            <Card.Text>
                                Connect with candidates
                            </Card.Text>
                            <NavLink to="/actions/conduit">Start connecting</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={3} xs={6}>
                    <Card >
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>U-Vote Solutions Teams</Card.Title>
                            <Card.Text>
                               Engage with other voters to solve problems in your community.
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