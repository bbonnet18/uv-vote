import './App.css';
import { Button, Row, Spinner, Col, Card, Modal } from "react-bootstrap";
import { useState } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Receiver(props) {
    const [loading,setLoading] = useState(false); 
    return (
        <Modal show={props.show} onHide={props.hide}>

            <Modal.Dialog className="receiver-dialog">

                {loading ? (
                    <div className="receiver-loading loading-centered">
                        <Spinner animation="border" role="status" className='loading-spinner spinner-bordered'> <span className="visually-hidden">Loading...</span></Spinner>
                    </div>) : (
                    <><Modal.Header closeButton>
                        <Modal.Title>Receiver</Modal.Title>
                       
                    </Modal.Header>
                        <Modal.Body>
                             <h4>Name: {props.receiver.firstname} {props.receiver.lastname}</h4>

                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={(e) => {
                                props.hide(false);
                            }}>Close</Button>
                        </Modal.Footer>
                    </>
                )}

            </Modal.Dialog>
        </Modal>

    )
}

export default Receiver; 