import './App.css';
import { Button, Row, Spinner, Col, Card, Modal } from "react-bootstrap";
import unescape from 'validator/lib/unescape';
import { useState, useEffect } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Receiver(props) {

    const partyMap = {
        'D':'Democratic',
        'R':'Republican',
        'I':'Independent',
        'L':'Libertarian',
        'G':'Green',
        'O':'Other'
    }


    let [newReceiver, setNewReceiver] = useState(null);
    useEffect(() => {

        let receiverKeys = Object.keys(props.receiver);

        let updatedReceiver = {};
        for(let i=0;i<receiverKeys.length;i++){
            updatedReceiver[receiverKeys[i]] = unescape(props.receiver[receiverKeys[i]].S); 
            updatedReceiver[receiverKeys[i]] = unescape(updatedReceiver[receiverKeys[i]]);
        }
        setNewReceiver(updatedReceiver);

    }, [props.receiver]);   


    return (
        <Modal show={props.show} onHide={props.hide} className='receiver-dialog'>

            <Modal.Dialog className="receiver-dialog">
                    <><Modal.Header closeButton>
                        <Modal.Title className='receiver-title'>Receiver</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            {newReceiver && newReceiver.lastname ? (
                                <div>
                                <div className='receiver-info'>Name: <span>{newReceiver.firstname} {newReceiver.lastname}</span></div>
                                <div className='receiver-info'>Office: <span>{newReceiver.office}</span></div>
                                <div className='receiver-info'>Category: <span>{newReceiver.category}</span></div>
                                <div className='receiver-info'>Party: <span>{partyMap[newReceiver.party]}</span></div>
                                <div className='receiver-info'>Locality: <span>{newReceiver.locality}</span></div>
                                <div className='receiver-info'>Website: <span><a href={newReceiver.website} target="_blank" rel="noopener noreferrer">{newReceiver.website}</a></span></div>
                                <div className='receiver-info'>Social Media: <span>{newReceiver.social}</span></div>
                            </div>
                            ) : (<></>) }
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={(e) => {
                                props.hide(false);
                            }}>Close</Button>
                        </Modal.Footer>
                    </>
            </Modal.Dialog>
        </Modal>

    )
}

export default Receiver; 