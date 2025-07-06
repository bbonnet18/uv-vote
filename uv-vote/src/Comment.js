import './App.css';
import { Button, Modal } from "react-bootstrap";
import Quotes from './Quotes';
import { useState,useEffect } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Comment(props) {

    const commentLimit = 250;
    const [currText, setCurrText] = useState(0);// to display text left before limit
    const [currVal, setCurrVal] = useState("");
    const [showQuote, setShowQuote] = useState(true);
    const [loading, setLoading] = useState(false); 


    useEffect(()=>{
        setInterval(()=>{
            setShowQuote(false); 
        },6500)
    },[]);

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

                {showQuote ? (<Quotes show={setShowQuote}></Quotes>
                   ) : (
                    <>
                        <Modal.Header closeButton>
                        <Modal.Title>Let's hear from you!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                             <h4>Topic: {props.topic}</h4>
                            <span>Text remaining: </span><span id="charLimit" >{currText}</span>
                            <div className='comment'><textarea onChange={(e) => {
                                let val = e.currentTarget.value;
                                setCurrVal(val);
                            }} onKeyUp={checkChar} placeholder='use this space to enter your text' value={currVal} />
                            <div className='comment-civil'>Hey... Let's put the <strong>civil</strong> back in civil discourse. You can be critical, but be constructive!</div>
                            </div>
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