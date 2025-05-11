import './App.css';

import { Container, Col, Row } from "react-bootstrap";

function About() {


  return (
    <>
      <div className="jumbotron text-center jumbotron-bg jumbotron-short jumbotron-about pt-3">
      </div>
      <Container className='mt-2'>
        <Row>

          <h2>About U-Vote</h2>
          <p>U-Vote is for voters! We exist to bring value to you as a voter, no matter how you vote. The way we see it, there’s a big gap between all the issues we care about and the few we actually get to vote on, and we intend to shrink that gap! We want to empower voters, by flipping the script and letting you vote on lots of issues, then taking those results to your elected officials and the public. While votes in U-Vote are non-binding, they do send a big message on your behalf. And, we keep it simple. Vote on your schedule, from your devices, and be heard on lots of topics all year.</p>

        </Row>
        <Row>
          <Col lg={12}>
            <h2>Who are we?</h2>
            <p>We are a small but growing group of voters here in Northern Virginia, who want to make it easier for citizens to make their voices heard. We have no political affiliation and we don't want one! We are very much about helping other voters, by offering simple, convenient ways to make yourself heard.</p>
          </Col>
        </Row>
        <Row id="elevate">
          <h2>It's going to take innovation</h2>
          <div className="mb-2 centered-img"><img id="voiceImg" src="ben-selfy.webp" /><figcaption className="figure-caption mb-2">Founder Ben Bonnet at U-Vote booth <br />at Arlington Courthouse Farmer's market</figcaption></div>
          <p>We think it's time to innovate and modernize and to augment the current voting system with modern tools for voters. Why? Well do problems like gerrymandering, term limits and money in politics frustrate you? Us too. We started our journey to create U-Vote out of frustration. It just didn’t seem right to us that issues with broad public support, like gerrymandering reform, campaign finance reform and term limits, never really get a vote. So we originally set out to tackle those specific issues.</p>
        </Row>
        <h3>The 'Representation Gap'</h3>
        <Row>
          <Col lg={6} sm={12} className='mb-3'>
            <div><img id="votingGap" src="voting_gap.png" /><figcaption id='repGap' className="figure-caption">Diagram showing the 'representation gap'</figcaption></div>
          </Col>
          <Col lg={6} sm={12}>
            <p>Along the way, we recognized the <strong>'representation gap’</strong> - the gap between what we care about and what we actually get to vote on. We realized that we could give people the ability to vote all year long on those issues that never end up on the ballot.</p>
            <p>U-Vote is in part, a response to the representation gap. We want to enable you to make your voice heard through <strong>simple, convenient and powerful actions</strong>.</p>
            <p>Creating a system that’s easy, dynamic and driven to give voters more of a voice is what we're all about!</p>
            <ul>
              <li>No special interests,</li>
              <li>no parties,</li>
              <li>no money</li>
            </ul>
            <p>So here we are, kicking off U-Vote beta testing! Help us innovate, become a <a href="/getkey" alt="get a voter key">beta tester</a> today!</p>
          </Col>

        </Row>

      </Container>
    </>
  )
}

export default About;

