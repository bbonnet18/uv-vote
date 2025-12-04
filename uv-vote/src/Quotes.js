import './App.css';
import { useState,useEffect } from 'react';
import { Container, Button, Col, Row, Spinner} from "react-bootstrap";

function Quotes(props){

    const quotes = [
        {index:1,quote:"The best way to predict your future is to create it.",author:"Abraham Lincoln (1863)",fade:"3"},
        {index:2,quote:"There is not a liberal America and a conservative America — there is the United States of America.",author:"Barack Obama (2004)",fade:"4"},
        {index:3,quote:"Ask not what your country can do for you – ask what you can do for your country.",author:"John F. Kennedy (1961)",fade:"4"},
        {index:4,quote:"Do what you can, with what you have, where you are.",author:"Theodore Roosevelt (1901)",fade:"3"},
        {index:5,quote:"We can't help everyone, but everyone can help someone.",author:"Ronald Reagan (1982)",fade:"3"},
        {index:6,quote:"The administration of justice is the firmest pillar of government.",author:"George Washington (1796)",fade:"4"},
        {index:7,quote:"It is not the years in your life that count. It’s the life in your years.",author:"Abraham Lincoln (1862)",fade:"4"},
        {index:8,quote:"The only limit to our realization of tomorrow will be our doubts of today.",author:"Franklin D. Roosevelt (1941)",fade:"4"},
        {index:9,quote:"We are the change that we seek.",author:"Barack Obama (2008)",fade:"2"},
        {index:10,quote:"Our lives begin to end the day we become silent about things that matter.",author:"Martin Luther King Jr. (1967)",fade:"4"},
        {index:11,quote:"It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better. The credit belongs to the man who is actually in the arena…",author:"Theodore Roosevelt (1910)",fade:"35"},
        {index:12,quote:"We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defense, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.",author:"Preamble to US Constitution",fade:"5"},
        {index:13,quote:"It is amazing what you can accomplish if you do not care who gets the credit.",author:"Harry S. Truman (1948)",fade:"4"},
        {index:14,quote:"We hold these truths to be self-evident: that all men and women are created equal.",author:"Elizabeth Cady Stanton (1848)",fade:"4"},
        {index:15,quote:"We, as a people, will get to the promised land. We, as a people, will get to the top of the mountain, but only if we do it together.",author:"Barbara Jordan (1976)",fade:"4"},
        {index:16,quote:"We all should know that diversity makes for a rich tapestry, and we must understand that all the threads of the tapestry are equal in value no matter their colour.",author:"Maya Angelou (1993)",fade:"5"},
        {index:17,quote:"The future belongs to those who believe in the beauty of their dreams.",author:"Eleanor Roosevelt (1948)",fade:"3"},
        {index:18,quote:"I am, and always will be, a catalyst for change.",author:"Shirley Chisholm (1972)",fade:"2"},
        {index:19,quote:"These are the times that try men’s souls.",author:"Thomas Paine (1776)",fade:"2"},
        {index:20,quote:"The only thing we have to fear is fear itself—nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance.",author:"Franklin D. Roosevelt (1933)",fade:"4"},

    ];

    const [quote,setQuote] = useState({});
    const [fadeClass, setFadeClass] = useState("u-vote-quote-text fade-in");
    const [authorFadeClass, setAuthorFadeClass] = useState("u-vote-author fade-in");
    const [hasClass, setHasClass] = useState(false); 


    useEffect(()=>{
        const chooseQuote=()=>{
            let quoteNum = Math.floor(Math.random() * 20);
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
                        let newFadeClass = `${fadeClass} fade-${quote.fade}`;
                        let newAuthorFadeClass = `${authorFadeClass} fade-${quote.fade}`;
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
                    <div id="voteQuote" className={fadeClass}>"{quote.quote}"</div>
                    <div className={authorFadeClass}>- <strong>{quote.author}</strong></div>
                </Col>
            </Row>
                <div className="loading-centered">
                    <Spinner animation="border" role="status" className='loading-spinner spinner-bordered'> <span className="visually-hidden">Loading...</span></Spinner>
                </div>
            <Row>
                <div className='quote-skip'>
                    <Button onClick={(e)=>{
                        props.show(false); 
                    }}>Skip</Button>
                </div>
            </Row>
        </Container>
    )
}

export default Quotes;