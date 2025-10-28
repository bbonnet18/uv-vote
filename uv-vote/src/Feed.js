import './App.css';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner} from "react-bootstrap";
import Comments from './Comments';
import VoteChart from './VoteChart';

function Feed (props){ 

    return (
        <Container className="feed-container">
            <Row><hr/></Row>
            {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>
            ) : (
                <>
                <h4>Title: {props.feed && props.feed.feed ? props.feed.feed.title : ""}</h4>
                <Row>
                    <Col md={12}>
                    <h5>Latest Comments</h5>
                    <Comments comments={props.feed && props.feed.comments ? props.feed.comments : []} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                    
                         {props.feed && props.feed.feed && props.feed.feed.surveyId ? 
                         ( <>
                         <h5>Current Vote Results</h5>
                         <VoteChart surveyId={props.feed.feed.surveyId} />
                         </>) : (<>
                         <hr/>
                            <h4>No survey yet available for this issue</h4>
                            </>)
                        }

                        
                            
                      
                    </Col>
                </Row>
                </>
            )}
        </Container>
    );
}
export default Feed;