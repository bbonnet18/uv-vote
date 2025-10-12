import './App.css';
import axios from "axios";
import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner} from "react-bootstrap";
import config from './config';
import Comments from './Comments';
import VoteChart from './VoteChart';
import unescape from 'validator/lib/unescape';

function Feed(props) {
    const [loading, setLoading] = useState(false);
    const [feed, setFeed] = useState({});

    useEffect(() => {
        const checkFeed = async () => {
            await getFeed(props.groupId, props.topicId);
        };
        checkFeed();
    }, [props.groupId, props.topicId]);



    const getFeed = async(groupId,topicId) => {
        try{
            setLoading(true);
        let payload = {
            groupId:groupId,
            topicId:topicId
        }
        const resObj = await axios.post(`${config.apiBaseUrl}/feeds/get-feed`, payload);
        setFeed(resObj.data);
        setLoading(false);
        } catch (error) {
            console.error("Error fetching feed:", error);
            setLoading(false);
        }
        
    }
    return (
        <Container>
            {loading ? (<div className="comment-loading loading-centered"><Spinner animation="border" role="status" className='loading-spinner'> <span className="visually-hidden">Loading...</span></Spinner></div>
            ) : (
                <div>
                    <h4>{feed && feed.feed ? feed.feed.title : ""}</h4>
                    <Comments comments={feed && feed.comments ? feed.comments : []} />
                    {feed && feed.feed && feed.feed.surveyId ? <VoteChart surveyId={feed.feed.surveyId} /> : null}
                </div>
            )}
        </Container>
    );
}
export default Feed;