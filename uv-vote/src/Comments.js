import './App.css';
import unescape from 'validator/lib/unescape';
import { Row } from "react-bootstrap";
function Comments(props) {
    // for some reason we need to double unescape to get rid of all the escape characters
    const cleanComment = (comment) => {
        let cm = unescape(comment).trim();
        let final = unescape(cm);
        return final;
    }
    return (
        <Row className="comments-section">
            {props && props.comments ? (props.comments.map((comment, ind) => {
                return (
                <div key={`comment-${ind}`} className="comment-item">
                    <div key={`comment-text-${ind}`}>{`"${cleanComment(comment.comment)}"`}</div>
                    <div className="comment-meta"><span>Gender: {comment.gender}</span> | <span>Age: {comment.age}</span> | <span>{comment.timestamp}</span></div>
                </div>);
            })) : (<div>No comments yet</div>)}
        </Row>
    );
}

export default Comments;