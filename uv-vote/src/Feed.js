import './App.css';
import axios from "axios";
import { React, memo, useState, useEffect } from 'react';
import { Container, Row, Col, Spinner} from "react-bootstrap";
import config from './config';
import Comments from './Comments';
import VoteChart from './VoteChart';
import unescape from 'validator/lib/unescape';
import { useNavigate } from 'react-router-dom';
import cookies from './cookies';

const Feed = memo(({groupId,topicId}) => {
    const [loading, setLoading] = useState(false);
    const [feed, setFeed] = useState({});
    const [feedChecked,setFeedChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkFeed = async () => {
            //await getFeed(groupId, topicId);
        };
        console.log('rerendering ---- ');
        if(feedChecked===false){
            checkFeed();
            setFeedChecked(true);
        }
      
    }, [groupId, topicId]);



    const getFeed = async(groupId,topicId) => {
        try{

             // get the JWT to use for auth
            const authCookie = cookies.getCookie('voterToken') || "";
            if (authCookie === "") {
    
            navigate('/validate');
            }
            // get the cookie and set the auth header
            const reqOpts = {
            headers: {
                "Authorization": `Bearer ${authCookie}`
            },
            withCredentials: true
            }
            setLoading(true);
            let payload = {
                groupId:groupId,
                topicId:topicId
            }
            const resObj = await axios.post(`${config.apiBaseUrl}/votes/get-feed`, payload, reqOpts);
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
                    <hr/>
                    <h4>{feed && feed.feed ? feed.feed.title : ""}</h4>
                    <Comments comments={feed && feed.comments ? feed.comments : []} />
                    {feed && feed.feed && feed.feed.surveyId ? <VoteChart surveyId={feed.feed.surveyId} /> : null}
                </div>
            )}
        </Container>
    );
})
export default Feed;