import './App.css';
import { NavLink } from "react-router-dom";
import { Button, Container, Row, Spinner, Col, Card, Modal } from "react-bootstrap";
import { useState } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Comment(props) {

    const commentLimit = 250;
    const [currText, setCurrText] = useState(0);// to display text left before limit
    const [currVal, setCurrVal] = useState("");
    const [loading, setLoading] = useState(false);

    // get the number of characters against the limit
    const checkChar = (e) => {
        let val = currVal;
        let totalLeft = commentLimit - val.length;
        let charLimitEl = document.getElementById('charLimit');
        if (totalLeft < 50) {
            charLimitEl.classList.add('danger')
        } else {
            if (charLimitEl.classList.contains('danger')) {
                charLimitEl.classList.remove('danger');
            }
        }
        setCurrText(totalLeft);
    }

    return (
        <Modal show={props.show} onHide={props.hide}>

            <Modal.Dialog className="comment-dialog">

                {loading ? (
                    <div className="comment-loading loading-centered">
                        <Spinner animation="border" role="status" className='loading-spinner spinner-bordered'> <span className="visually-hidden">Loading...</span></Spinner>
                    </div>) : (
                    <><Modal.Header closeButton>
                        <Modal.Title>Enter Comment</Modal.Title>
                       
                    </Modal.Header>
                        <Modal.Body>
                             <h4>Topic: {props.topic}</h4>
                            <span>Text remaining: </span><span id="charLimit" >{currText}</span>
                            <div className='comment'><textarea onChange={(e) => {
                                let val = e.currentTarget.value;
                                setCurrVal(val);
                            }} onKeyUp={checkChar} placeholder='use this space to enter your text' value={currVal} /></div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={(e) => {
                                props.hide(false);// this is setTryComment from conduit
                            }}>Cancel</Button>
                            <Button variant="primary" onClick={async (e) => {
                                setLoading(true);
                                try {
                                    if (currVal && currVal.length) {
                                        let comment = currVal;
                                        await props.send(comment);
                                    }

                                    setLoading(false);
                                } catch (err) {
                                    setLoading(false);
                                }
                            }}>Send</Button>
                        </Modal.Footer>
                    </>
                )}

            </Modal.Dialog>
        </Modal>

    )
}

export default Comment; 