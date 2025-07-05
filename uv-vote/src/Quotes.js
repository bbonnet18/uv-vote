import './App.css';
import { useState,useEffect } from 'react';
import { Container, Row, Col} from "react-bootstrap";

function Quotes(){
    const [quote,setQuote] = useState("his is a great big quote from me about stuff");
    //setQuote("This is a great big quote from me about stuff")
    return (
        <Container>
            <Row>
                <Col sm={12} className='u-vote-quote'>
                    <h4 className='u-vote-quote-title'>Be inspired:</h4>
                    <div className='u-vote-quote-text fade-in'>{quote}</div>
                    <div className='u-vote-author'></div>
                </Col>
            </Row>
        </Container>
    )
}

export default Quotes;