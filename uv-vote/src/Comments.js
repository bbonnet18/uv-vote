import './App.css';
import unescape from 'validator/lib/unescape';
import { Row } from "react-bootstrap";
function Comments(props) {

    return (
        <Row className="comments-section">
            {props && props.comments ? (props.comments.map((comment, ind) => {
                return (
                <div key={`comment-${ind}`} className="comment-item">
                    <div key={`comment-text-${ind}`}>{`"${unescape(comment.comment).trim()}"`}</div>
                    <div className="comment-meta"><span>Gender: {comment.gender}</span> | <span>Age: {comment.age}</span> | <span>{comment.timestamp}</span></div>
                </div>);
            })) : (<div>No comments yet</div>)}
        </Row>
    );
}

export default Comments;