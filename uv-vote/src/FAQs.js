import './App.css';

import { Container, Col, Row, Accordion} from "react-bootstrap";

function FAQs() {

return(
<>
<div className="jumbotron text-center">
  <div className='banner-text'>
  </div>
</div>
<Container className='mt-2'>
 
  <h2>FAQs</h2>
    <p>U-Vote is a new approach to voter representation and civic engagement, so we're sure you will have some questions. We do our best below to provide answers to some anticipated questions. Feel free to reach out with other questions to our support email: <a href="mailto:support@u-vote.us" alt="U-Vote support">U-Vote Support</a></p> 
<Row className='mt-4'>
  <Col lg={12} >
  <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>What is a voter key?</Accordion.Header>
        <Accordion.Body>
        A voter key is simply a code that U-Vote provides to you and only you. U-Vote does not keep a copy of your voter key, so only you have it. Voter keys keep your vote anonymous. Voter keys are issued once a quarter and will work for all votes held in that quarter.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Is U-Vote a political party?</Accordion.Header>
        <Accordion.Body>
        No. U-Vote is not aligned with any political party or ideology. U-Vote helps voters to be heard on a number of issues throughout the year, while making participation easy and convenient.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Who owns U-Vote?</Accordion.Header>
        <Accordion.Body>
        U-Vote is owned by the voters and exists solely to help increase voter representation on issues all year. U-Vote is managed by a small, but growing group of voters with diverse political stances. Our goal is to help voters of all political stripes to be heard all year round, not just on voting day.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Do U-Vote votes count in general elections?</Accordion.Header>
        <Accordion.Body>
        <strong>No.</strong> U-Vote represents voters by providing the data and results from votes to the public and elected officials. As data, U-Vote can provide trends, themes and breakdowns to illustrate concerns and highlight common ground. So no, your U-Vote vote does not count in a general election. Instead, U-Vote brings your perspective to elected officials as it is represented in the data.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>How do I register for U-Vote?</Accordion.Header>
        <Accordion.Body>
         Check out our video here <a href="https://youtu.be/v5ZF-8x6C7k" target='_blank' alt="video: how registration works">How Registration Works</a>. Registration can be done online at <a href="/getkey" alt="get a voter key">get a voter key</a> or at one of our in-person events around Arlington. 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header>How does U-Vote represent my vote?</Accordion.Header>
        <Accordion.Body>
        U-Vote represents voters by providing the data and results from votes to the public and elected officials. As data, U-Vote can provide trends, themes and breakdowns to illustrate concerns and highlight common ground. 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="6">
        <Accordion.Header>What is a perspective Vote? (<img src="perspective_sm.png" alt="perspective type vote" title="perspective type vote"></img>)</Accordion.Header>
        <Accordion.Body>
          A perspective vote measures voter opinions on a particular topic. U-Vote takes your opinion and the opinions of fellow voters and gathers themes and trends based on those opinions. These themes and trends help us identify common ground along with informing the public and elected officials on your perspective. 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="7">
        <Accordion.Header>What is a ballot vote? (<img src="ballot_sm.png" alt="ballot type vote" title="ballot type vote"></img>)</Accordion.Header>
        <Accordion.Body>
          A ballot vote is taken directly from the upcoming or recent ballots in your area. Official votes usually only provide you with a binary choice (yes or no on a measure, or selection of a single candidate, etc.). U-Vote ballot votes can go deeper to try to understand why you voted the way you did, so we can better represent your decision. For example, you might vote no on a ballot measure about county spending. The official vote will only register that you voted no. U-Vote can get at why you voted no, was it because of the cost? was it because you simply don't support the project? or was it something else? U-Vote often lets you state your specific reasons if one of the choices we provide doesn't represent you. 
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    
  </Col>
</Row>
<hr></hr>
</Container>
</>
)
}

export default FAQs;

