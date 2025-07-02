import './App.css';
import { Button, Row, Spinner, Col, Card, Modal } from "react-bootstrap";
import { useState } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Receiver(props) {
    return (
        <Modal show={props.show} onHide={props.hide} className='receiver-dialog'>

            <Modal.Dialog className="receiver-dialog">
                    <><Modal.Header closeButton>
                        <Modal.Title className='receiver-title'>Receiver</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <div className='receiver-info'>Name: <span>{props.receiver.firstname.S} {props.receiver.lastname.S}</span></div>
                            <div className='receiver-info'>Office: <span>{props.receiver.office.S}</span></div>
                            <div className='receiver-info'>Level: <span>{props.receiver.level.S}</span></div>
                            <div className='receiver-info'>Status: <span>{props.receiver.status.S}</span></div>
                            <div className='receiver-info'>Website: <span>{props.receiver.website && props.receiver.website.S ? props.receiver.website.S:""}</span></div>
                            <div className='receiver-info'>Social Media: <span>{props.receiver.social && props.receiver.social.S ? props.receiver.social.S : ""}</span></div>
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