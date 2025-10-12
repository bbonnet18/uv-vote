import './App.css';

function Comments(props) {
    return (
        <div>
            {props && props.comments ? (props.comments.map((comment, ind) => {
                return (
                <div>
                    <div key={ind}>{comment.comment}</div>
                    <div><span>{comment.gender}</span> | <span>{comment.age}</span> | <span>{comment.timestamp}</span></div>
                </div>);
            })) : (<div>No comments yet</div>)}
        </div>
    );
}

export default Comments;