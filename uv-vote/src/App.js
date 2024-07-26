import './App.css';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function App() {

  return (
    <>
    <div className="icon-brand"><div className='container'><a><img src='u-vote-logo-new-trans.png' ></img></a>U-Vote<div className='alpha-mark'>0.1 ALPHA</div></div></div>
    <Container fluid className='p-0'>
      <Container className='top-nav'>
      <Navbar></Navbar>
      </Container>
    <Outlet />
    </Container>
    </>
  );
}


/**
 *  <Container className='mt-2'>
      <Form id="voterForm" className='mb-3'> 
       <Form.Group controlId='voterKey' className='mb-3' as={Col} lg={8}>
        <Form.Label for="voterKey">
        Enter your voter key:
        </Form.Label>
        <Form.Control id="voterKey" name="voterKey" type="text" placeholder="voter key"  required />
       </Form.Group>
       <Button variant='primary'  onClick={()=>getVotes()}>Get Votes</Button>
      </Form>
      <Row className="justify-content-md-center">
        <Col lg={12}>
        {loading ? 
           <Spinner animation="border" role="status">
           <span className="visually-hidden">Loading...</span>
         </Spinner> : <VoteList votes={votes}></VoteList>
      } 
        </Col>
        
      </Row>
     
    </Container>
 */