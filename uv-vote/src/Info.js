import './App.css';

import { Container, Col, Row, Card,} from "react-bootstrap";

function Info() {



return(
<>
<div className="jumbotron text-center">
  <div className='banner-text'>
  </div>
</div>
<Container className='mt-2'>
 
  <h2>Welcome to U-Vote</h2>
    <p>U-Vote is a modern voting platform, built to allow you to be heard all year round, not just on election day. U-Vote is currently in testing in Arlington VA, and we're looking for volunteer voters to work with the system.</p> 
    <p>U-Vote is <strong>safe, secure and anonymous</strong> - the way voting should be. We're focused on delivering a system that allows you to engage in a fast and convenient way. You can become a test voter today by getting a voter key. Check out the short video below on registration to see how it works. Then get started with a <a href="/getkey" alt="get a voter key">voter key</a>   
    <br></br>
    <br></br>
   </p>
   <h4>See how registration works</h4>
    <div><iframe width="350" height="315" src="https://www.youtube.com/embed/v5ZF-8x6C7k?si=gyLEvsXiOfi94ikg" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe></div>
    <br></br>
<Row className='mt-4'>
  <Col lg={6} sm={12}>
    <Card>
    <Card.Body>
        <Card.Title>Become a test voter!!</Card.Title>
        <Card.Text>
          U-Vote is testing in Arlington VA. We'll learn in Arlington and start rolling out to other areas. 
          Helping is easy, just tap or click the link below to register and you'll recieve a voter key so you can vote.
        </Card.Text>
        <Card.Link href="/getkey">Register</Card.Link>
      </Card.Body>

    </Card>
  </Col>
  <Col lg={6} sm={12}>
    <Card>
      <Card.Body>
        <Card.Title>
        Interested in helping out with U-Vote?
        </Card.Title>
        <Card.Text>
        We're looking for people to help us build out U-Vote in Arlington. U-Vote is a startup, focused on better representation for all. We would love to hear from you.
        </Card.Text>
        <Card.Link href='mailto:benjamin.a.bonnet@u-vote.us' alt="contact u-vote">Contact U-Vote</Card.Link>
      </Card.Body>
    </Card>
  </Col>
</Row>
<hr></hr>
<h2>What is U-Vote?</h2>
<p>U-Vote is a modern voting system. Our venerable voting system has served us for over 200 years and remains the binding way we make decisions on our leaders and our intentions at the federal, state and local level. But the system has its limitations. For example, we only vote once a year and only on a few issues and candidates. At U-Vote, we think we can do better. We all know that there are far more issues of concern than those that end up on the ballot each year. U-Vote intends to close that gap between the relatively small amount covered on a typical ballot and how voters really feel about issues both on and off the ballot. 
</p>
<Row>

</Row>
<Row>
    <Col lg={6} sm={12} className='mt-4'>
    <Card >
      <Card.Img variant='top' src="devices.png"></Card.Img>
      <Card.Body>
        <Card.Title>Modern Voting</Card.Title>
        <Card.Text>
          Voting that's convenient and feels like it should in the 21st century. <br></br>Watch the <a href="https://youtu.be/bHeLAYnaKD8" target='_blank' alt="one minute overview video" title="one minute overview video">one minute overview</a> video. 
        </Card.Text>
        {/* <Card.Link href="/about">See how we do it</Card.Link> */}
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
        {/* <Card.Link href="/about">How we amplify your voice</Card.Link> */}
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

