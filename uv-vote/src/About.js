import './App.css';

import { Accordion, Container, Col, Row, Card,} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function About() {

    const navigate = useNavigate();


return(
<Container fluid="md" className='mt-2'>
  <Row>
  
         <h2>About U-Vote</h2>
    <p>U-Vote is a voting platform that exists to provide you, the <strong>Voter</strong>, with a direct and convenient way to engabe with your local, state and federal government. U-Vote votes are non-binding, but address the number one reason we vote - to tell them how we feel!</p>
    <hr></hr>
   
  </Row>

<Row fluid="md">
    <Col lg={6} sm={12} xs={12} className='mt-4'>
    <Card style={{ width: '25rem' }}>
      <Card.Body>
        <Card.Title>U-Vote is convenient</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">A modern voting experience.</Card.Subtitle>
        <Card.Text>
          Vote with your smartphone, tablet or computer on issues that matter to you. 
        </Card.Text>
        <Card.Link href="#">Get a voter key</Card.Link>
      </Card.Body>
    </Card>
    </Col>
    <Col lg={6} sm={12} xs={12}  className='mt-4'>
    <Card style={{ width: '25rem' }}>
      <Card.Body>
        <Card.Title>Anonymous</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">21st century voting</Card.Subtitle>
        <Card.Text>
          U-Vote is a lot like normal voting, just WAY more convenient and we cover more issues that matter to you. Your votes are anonymous, we just maintain a voter roll like a normal election office would.
        </Card.Text>
        <Card.Link href="#">See how it works</Card.Link>
      </Card.Body>
    </Card>
    </Col>

</Row>
</Container>
)
}

export default About;

