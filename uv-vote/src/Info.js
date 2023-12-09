import './App.css';

import { Container, Col, Row, Card,} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Info() {

    const navigate = useNavigate();


return(
<>
<div class="jumbotron text-center">
  <img src="statue_of_liberty_banner.jpg"  />
  <div className='banner-text'>
  <h1>U-Vote</h1> 
  <p>A modern voting experience</p> 
  </div>

</div>
<Container className='mt-2'>
 
  <h2>Welcome to U-Vote</h2>
    <p>U-Vote is a voting platform that exists to provide you, the voter, with a direct and convenient way to provide your input to your local, state and federal government. U-Vote votes are non-binding, but address the number one reason we vote - to tell them how we feel!</p>
    <p><a href="/getkey" alt="get a voter key">Get a voter key</a></p>
<hr></hr>
<h2>What is U-Vote?</h2>
<p>U-Vote is a modern voting system. Our venerable voting system has served us for over 200 years and remains the binding way we make decisions on our leaders and our intentions at the federal, state and local level. But the system has its limitations. For example, we only vote once a year and only on a few issues and candidates. At U-Vote, we think we can do better. We all know that there are far more issues of concern than those that end up on the ballot each year. U-Vote intends to close that gap between the relatively small amount covered on a typical ballot and how voters really feel about issues both on and off the ballot. 
</p>
<Row>
    <Col lg={6} sm={12} className='mt-4'>
    <Card >
      <Card.Img variant='top' src="devices.png"></Card.Img>
      <Card.Body>
        <Card.Title>Modern Voting</Card.Title>
        <Card.Text>
          Voting that's convenient and feels like it should for the 21st century. 
        </Card.Text>
        <Card.Link href="/about">See how we do it</Card.Link>
      </Card.Body>
    </Card>
    </Col>
    <Col lg={6} sm={12} className='mt-4'>
    <Card >
      <div className='voter-img'></div>
      <Card.Body>
        <Card.Title>Be Heard</Card.Title>
        <Card.Text>
          Voters are unique, we're humans afterall. We value things differently and U-Vote helps bring those values home to policy makers and elected officials.  
        </Card.Text>
        <Card.Link href="/about">How we amplify your voice</Card.Link>
      </Card.Body>
    </Card>
    </Col>

</Row>
<hr></hr>

</Container>
</>
)
}

export default Info;

