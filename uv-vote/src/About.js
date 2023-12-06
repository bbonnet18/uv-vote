import './App.css';

import { Accordion, Figure, Container, Col, Row, Card,} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function About() {

    const navigate = useNavigate();


return(
<>
<div class="jumbotron text-center">
  <h1>U-Vote</h1> 
  <p>A modern voting experience</p> 
</div>
<Container  fluid="md" className='mt-2'>
  <Row>
  
    <h2>About U-Vote</h2>
    <p>U-Vote is a voting platform that exists to provide you, the <strong>Voter</strong>, with a direct and convenient way to engage with your elected officials at the local, state and federal level. U-Vote votes are non-binding, but address the number one reason we vote - to tell them how we feel!</p>
   
  </Row>

 <Row className='pb-3 mb-2'> 
    <Col lg={4} sm={12} xs={12} className='mt-4'>
    <Card >
      <Card.Img id="modernPhone" variant='top' src="to-do-list-736_640.png"></Card.Img> 
      <Card.Body>
        
        <Card.Title></Card.Title>
        <Card.Subtitle className="mb-2 text-muted">A modern voting experience.</Card.Subtitle>
        <Card.Text>
          Vote with your smartphone, tablet or computer on issues that matter to you. 
        </Card.Text>
        <Card.Link href="#">Get a voter key</Card.Link>
      </Card.Body>
    </Card>
    </Col>
    <Col lg={8} sm={12} xs={12}  className='mt-4'>
    <h2>U-Vote is...</h2>
    <p>While U-Vote helps in a lot of ways, there are a few that set it apart from the way we currently vote.</p>

        <ul className='u-vote-description'>
          <li>Convenient, you can do everything from any of your devices</li>
          <li>Anonymous, like you would vote in a normal election, just online</li>
          <li>Representative, we take voting data to your elected officials to make sure you are heard</li>
          <li>Continuous, you don’t have to wait for a once-a-year election to be heard</li>
        </ul>

    <p>We can unlock true voter sentiment by making things easy and more widely reflective of voter positions on issues. We can then tap into vote results and provide a more complete picture, including where voters draw the line on certain policies and where we find common ground. With this data, we hope to improve the ability of elected officials to provide productive policies for the American People.</p>
    </Col>

</Row>
<Row>
  <Col sm={8}>
    <h2>How we elevate your voice</h2>
    <p>Imagine you only get once a year to make your voice heard by your elected officials. Now imagine that once a year moment, you can ony express yourself through yes or no answers or by checking a box for one candidate or another. Going further, now imagine that there are only a couple of issues or races, so you have to limit yourself to whatever is on the ballot.</p>
    <p>Wow, that's pretty restrictive... but that's the reality we live in.</p> 
    <ul>
      <li>What if you wanted to provide some additonal feedback other than yes or no? or a selection for a single candidate?</li>
      <li>What if you didn't want any of the candidates that were on the ballot?</li>
      <li>What if you wanted to express your voice on something that wasn't on the ballot at all?</li>
    </ul>
    <p>With U-Vote, you can make your voice heard on a range of issues over the course of the year. We also allow you to express yourself beyond the simple binary choices you see on a typical ballot. We can take the feedback you provide and bring it directly to elected officials and policy makers to make sure you're heard on the issues you care about.</p>
  </Col>
  <Col sm={4}>
    <div className="centered-img"><img id="voiceImg" src="interviewer_sm.jpeg" /></div>
  </Col>
</Row>
<Row>
  <Col lg={6} sm={12} className='mt-4'>
  <h3>How we handle your anonymity</h3>
  <Row>
    <Col lg={{span:10,offset:1}} className='x-offset-1'>
    <Figure>
    <Figure.Image  width={431} height={228} alt="431x228" src="proxy.drawio.png">

    </Figure.Image>
    <Figure.Caption>
      You are anonymous when voting because we create a copy of you to use n the voting system
    </Figure.Caption>
  </Figure>
  <p>U-Vote creates an anonymous copy of you and puts that anonymous copy in the voting system. We send you a key, that allows you to operate as the anonymous copy in the system. Basically, you anonymous copy votes and that's all the system knows about.</p>
    </Col>
  </Row>
  
  </Col>
  <Col lg={6} sm={12} className='mt-4'>
  <Card style={{ width: '25rem' }}>
  <Card.Img variant='top' src="avatar-3814081_640.png"></Card.Img> 
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
<Row>
 
</Row>
<Row className='mt-3 mb-3'>
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
</>
)
}

export default About;

