import './App.css';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner} from "react-bootstrap";
import config from './config';
import Comments from './Comments';
import VoteChart from './VoteChart';
import unescape from 'validator/lib/unescape';
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';

function Feed (props){ 

    return (
        <Container>
            {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>
            ) : (
                <div>
                    <hr/>
                    <h4>{props.feed && props.feed.feed ? props.feed.feed.title : ""}</h4>
                    <Comments comments={props.feed && props.feed.comments ? props.feed.comments : []} />
                    {props.feed && props.feed.feed && props.feed.feed.surveyId ? <VoteChart surveyId={props.feed.feed.surveyId} /> : null}
                </div>
            )}
        </Container>
    );
}
export default Feed;