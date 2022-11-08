import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React, {useState} from "react";

export default function AddMeteringDeviceButton () {

    const [show, setShow] = useState(false);
    const [description,setDescription] = useState("")
    const [address,setAddress] = useState("")
    const [max_hour_energy_cons,setmax_hour_energy_cons] = useState("")
    const [client,setClient] = useState("")
    const handleShow = () => {setShow(true);seterrorMessageForLabel("")}
    const [errorMessageForLabel,seterrorMessageForLabel]=useState("");
    const initializeModal = () => {
        setDescription("");
        setAddress("");
        setmax_hour_energy_cons("");
        setClient("")
    }
    const handleClose = () => {setShow(false);
        setDescription("");
        setAddress("");
        setmax_hour_energy_cons("");
        setClient("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let d = {
            description: description,
            address: address,
            max_hour_energy_cons: max_hour_energy_cons,
            client: client
        }
        let response = await fetch("http://localhost:8081/oeupb/addMeteringDevice", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(d)
        }).then(function (res) {
            return res.text();
        }).then(function (ok) {
            console.log(ok);
            if(ok!=="The device has been successfully created."){
                seterrorMessageForLabel(ok);
            }
            else{
                handleClose();
            }
        })
    }

    return (
        <>
            <Button className="HomepageButton" onClick={handleShow}>
                Add Device
            </Button>

            <Modal className="ModalStyle" style={{opacity:1}} show={show} onShow={initializeModal} onHide={handleClose}
                   size="sm"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>One device.<br></br>Endless possibilities.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Form>
                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalDescription">
                                <Col sm={2}>
                                    <Form.Control type="text" placeholder="Description" onChange={(e)=>setDescription(e.target.value)} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalAddress">

                                <Col sm={2}>
                                    <Form.Control type="text" placeholder="Address" onChange={(e)=>setAddress(e.target.value)}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formHorizontalmax_hour_energy_cons" >

                                <Col sm={2}>
                                    <Form.Control type="text" placeholder="max_hour_energy_cons" onChange={(e)=>setmax_hour_energy_cons(e.target.value)}/>
                                </Col>
                            </Form.Group>
                            {
                                errorMessageForLabel!==""&&
                                <>
                                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalLabel">

                                        <Col sm={2}>
                                            <Form.Label>{errorMessageForLabel}</Form.Label>
                                        </Col>
                                    </Form.Group>
                                </>

                            }
                            <Button className="HomepageButton" onClick={(e) => handleSubmit(e)}>
                                Submit
                            </Button>
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>
    )
}