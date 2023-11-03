import './App.css';

import { Accordion, Container, Col, Row, Card,} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function About() {

    const navigate = useNavigate();


return(
<Container className='mt-2'>
  <h2>About U-Vote</h2>
    <p>U-Vote is a voting platform that exists to provide you, the voter, with a direct and convenient way to provide your input to your local, state and federal government. U-Vote votes are non-binding, but address the number one reason we vote - to tell them how we feel!</p>
<hr></hr>
<Row>
    <Col lg={6} sm={12} className='mt-4'>
    <Card style={{ width: '25rem' }}>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card>
    </Col>
    <Col lg={6} sm={12} className='mt-4'>
    <Card style={{ width: '25rem' }}>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card>
    </Col>

</Row>
</Container>
)
}

export default About;

