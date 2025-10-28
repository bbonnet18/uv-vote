
import './App.css';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner} from "react-bootstrap";
import Comments from './Comments';
import VoteChart from './VoteChart';

function Feed (props){ 
    const [loading, setLoading] = useState(false);
    const [feed, setFeed] = useState({});
    const [feedChecked,setFeedChecked] = useState(false);

    // useEffect(() => {
    //     const checkFeed = async () => {
    //         await getFeed(props.groupId, props.topicId);
    //     };
    //     console.log('rerendering ---- ');
    //     if(feedChecked===false){
    //         checkFeed();
    //         setFeedChecked(true);
    //     }
      
    // }, [props.groupId, props.topicId]);



    // const getFeed = async(groupId,topicId) => {
    //     try{

    //          // get the JWT to use for auth
    //         const authCookie = cookies.getCookie('voterToken') || "";
    //         if (authCookie === "") {
    
    //         navigate('/validate');
    //         }
    //         // get the cookie and set the auth header
    //         const reqOpts = {
    //         headers: {
    //             "Authorization": `Bearer ${authCookie}`
    //         },
    //         withCredentials: true
    //         }
    //         setLoading(true);
    //         let payload = {
    //             groupId:groupId,
    //             topicId:topicId
    //         }
    //         const resObj = await axios.post(`${config.apiBaseUrl}/votes/get-feed`, payload, reqOpts);
    //         setFeed(resObj.data);
    //         setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching feed:", error);
    //             setLoading(false);
    //     }

    
        
    // }
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
