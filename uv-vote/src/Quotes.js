import './App.css';
import { useState,useEffect } from 'react';
import { Container, Button, Col, Row, Spinner} from "react-bootstrap";

function Quotes(props){

    const quotes = [
        {index:1,quote:"Quote 1",author:"first",fade:"3"},
        {index:2,quote:"Quote 2",author:"second",fade:"3"},
        {index:3,quote:"Quote 3",author:"third",fade:"4"},
        {index:4,quote:"Quote 4",author:"fourth",fade:"2"},
        {index:5,quote:"Quote 5",author:"fifth",fade:"1"},
        {index:6,quote:"Quote 6",author:"sixth",fade:"5"},
        {index:7,quote:"Quote 7",author:"seventh",fade:"2"},
        {index:8,quote:"Quote 8",author:"eigth",fade:"3"},
        {index:9,quote:"Quote 9",author:"ninth",fade:"4"},
        {index:10,quote:"Quote 10",author:"tenth",fade:"1"},
    ];

    const [quote,setQuote] = useState({});
    const [fadeClass, setFadeClass] = useState("u-vote-quote-text fade-in");
    const [authorFadeClass, setAuthorFadeClass] = useState("u-vote-author fade-in");
    const [hasClass, setHasClass] = useState(false); 
    const [hasQuote, setHasQuote] = useState(false); 


    useEffect(()=>{
        const chooseQuote=()=>{
            let quoteNum = Math.floor(Math.random() * 10);
            let quote = quotes[quoteNum];
            setQuote(quote);
        }
        if(!hasClass){
            chooseQuote();
            setHasClass(true);
        }
    },[])

    useEffect(()=>{
            const fadeFunc=()=>{
                    if(quote && quote.quote){
                        console.log('quote: ', quote); 
                        let newFadeClass = `${fadeClass} fade-${quote.fade}`;
                        let newAuthorFadeClass = `${authorFadeClass} fade-${quote.fade}`;
                        console.log('fade: ', newFadeClass, ' author: ', newAuthorFadeClass);
                        setFadeClass(newFadeClass); 
                        setAuthorFadeClass(newAuthorFadeClass);
                    }
            }
            fadeFunc(); 
        
    },[quote]);



    return (
        <Container>
            <Row>
                <Col sm={12} className='u-vote-quote'>
                    <h4 className='u-vote-quote-title'>Be inspired:</h4>
                    <div id="voteQuote" className={fadeClass}>{quote.quote}</div>
                    <div className={authorFadeClass}>- {quote.author}</div>
                </Col>
            </Row>
                <div className="loading-centered">
                    <Spinner animation="border" role="status" className='loading-spinner spinner-bordered'> <span className="visually-hidden">Loading...</span></Spinner>
                </div>
            <Row>
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button onClick={(e)=>{
                        props.show(false); 
                    }}>Skip</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Quotes;