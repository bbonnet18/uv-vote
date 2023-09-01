import './App.css';
import Home from './Home';
import Register from './Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
   
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