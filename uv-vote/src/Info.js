import './App.css';

import { Accordion, Container, Col, Row, Card,} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Info() {

    const navigate = useNavigate();


return(
<Container className='mt-2'>
  <h2>Welcome to U-Vote</h2>
    <p>U-Vote is a voting platform tha exists to provide you, the voter, with a direct and convenient way to local, state and federal government. U-Vote votes are non-binding, but address the number one reason we vote - to tell them how we feel!</p>
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
<hr></hr>
<Row id="keyInfo">
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>What's a voter key?</Accordion.Header>
          <Accordion.Body>
            (A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key. )
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I get a key?</Accordion.Header>
          <Accordion.Body>
            (A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key. )
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I vote?</Accordion.Header>
          <Accordion.Body>
            (A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key. )
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Row>
</Container>
)
}

export default Info;

