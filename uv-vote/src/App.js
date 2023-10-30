import './App.css';
import Home from './Home';
import Register from './Register';
import Confirm from './Confirm';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";


export default function App() {

  return (
    <Container> 
    <Navbar></Navbar>
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/getkey" element={<Register />} />
        <Route path="/complete" element={<Confirm />} />
      </Routes>
    </BrowserRouter>
   
    </Container>
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