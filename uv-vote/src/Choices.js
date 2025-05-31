import './App.css';
import { NavLink } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

function Choices() {

    return (
        <Container>
            <Row>
                <Col lg="12">
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                            <NavLink to="/actions/conduit">Check out Conduit</NavLink>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )

}

export default Choices; 