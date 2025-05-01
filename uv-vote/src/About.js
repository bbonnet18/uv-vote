import './App.css';

import { Accordion, Figure, Container, Col, Row, Card,} from "react-bootstrap";

function About() {


return(
<>
<div className="jumbotron text-center jumbotron-bg jumbotron-short jumbotron-about pt-3">
</div>
<Container className='mt-2'>
  <Row>
  
    <h2>About U-Vote</h2>
    <p>U-Vote is for voters! We exist to bring value to you as a voter, no matter how you vote. The way we see it, there’s a big gap between all the issues we care about and the few we actually get to vote on, and we intend to shrink that gap! We want to empower voters, by flipping the script and letting you vote on lots of issues, then taking those results to your elected officials and the public. While votes in U-Vote are non-binding, they do send a big message on your behalf to your elected officials and the public. And, we keep it simple. Vote on your schedule, from your devices, and be heard on lots of topics all year.</p>
   
  </Row>    
  <h2>How we got started</h2>
<Row id="elevate" className='mt-3'>
  <Col lg={6} sm={12}>
  <div className="mb-2 centered-img"><img id="voiceImg" src="ben-selfy.webp" /><figcaption>U-Vote booth at Arlington Courthouse Farmer's market</figcaption></div>
  </Col>
    <Col lg={6} sm={12}>
    <p>Do problems like gerrymandering, term limits and money in politics frustrate you? Me too. I started my journey to create U-Vote out of frustration. It just didn’t seem right to me that issues with broad public support, like gerrymandering reform, campaign finance reform and term limits, never really get a vote. So I originally set out to tackle those specific issues.</p>
    </Col>
</Row>
<Row>
  <Col lg={6} sm={12}>
  <p>Along the way, I recognized the ‘voting gap’ - i.e. we really don’t get to vote on much each year, but we care about a lot. I realized that we could give people the ability to vote all year long on those issues that never end up on the ballot. And with a software development and user experience background, I thought we could create a system that was simple, convenient and impactful for voters. And here we are, kicking off U-Vote beta testing!</p>
  </Col>
  <Col lg={6} sm={12}>
  <div><img id="votingGap" src="voting_gap.png" /></div>
  </Col>
</Row>
{/* <Row className='mt-3 alt-grey'>
  <Col lg={8} sm={12} className='mt-4'>
  <h3>How we handle your anonymity</h3>
  <Row>
    <Col lg={{span:10,offset:1}} className='x-offset-1'>
    <Figure>
    <Figure.Image  width={431} height={228} alt="431x228" src="proxy.drawio.png">

    </Figure.Image>
    <Figure.Caption>
      You are anonymous when voting because we create a copy of you to use in the voting system
    </Figure.Caption>
  </Figure>
  <p>U-Vote creates an anonymous copy of you and puts that anonymous copy in the voting system. We send you a key, that allows you to operate as the anonymous copy in the system. Basically, your anonymous copy votes and that's all the system knows about.</p>
    </Col>
  </Row>
  
  </Col>
  <Col lg={4} sm={12} className='mt-4'>
  <Figure>
    <Figure.Image width={300} height={300} alt="400x400" src="avatar-bw.jpg">
      
    </Figure.Image>
    <Figure.Caption>
      Administrators do not have access to your voter key. Your voter key is kept separately from your data in the voter roll.  Matching your key to you can only be done in certain circumstances based on a request from you. This is just one step we take to keep your voting record anonymous.  
    </Figure.Caption>
  </Figure>
  </Col>
</Row> */}
<Row>
Issues like gerrymandering 
Frustrations with current mechanisms to make voice heard
Creating a system that’s easy, dynamic and powerful

No special interests, no parties, no money

All that’s missing is you

</Row>
{/* <Row className='mt-3 mb-3'>
<Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>What's a voter key?</Accordion.Header>
          <Accordion.Body>
            A voter key is used to vote. Voter keys are anonymous to the voting system, 
            only you know how you vote and only you can vote with your voter key. 
            Get a voter key by <a href="/getkey">registering</a>. We'll validate your identity and send you a 
            text message with your key.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>How do I get a key?</Accordion.Header>
          <Accordion.Body>
            You can get a key by <a href="/getkey">registering</a>. We will validate your identity and add you to the appropriate voting areas based on your state and local area. You will receive a voting key and you will use that to vote, it's pretty simple.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>How do I vote?</Accordion.Header>
          <Accordion.Body>
            Once you receive a key, you can go to <a href="/votes">your votes</a> to see what votes are taking place in your state and local area, as well as any national votes. From there, simply click the link for a vote and vote how you see fit.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

</Row> */}

</Container>
</>
)
}

export default About;

