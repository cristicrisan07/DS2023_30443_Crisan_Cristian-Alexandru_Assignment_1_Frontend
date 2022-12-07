import React, {useEffect, useState} from "react";
import {Card, Col, Row, Toast} from "react-bootstrap";
import SockJsClient from 'react-stomp';


import MyToast from "./MyToast";


const CustomerView = (props) => {

    const SOCKET_URL = 'http://localhost:8081/oeupb/stomp';

    const [showToast,setshowToast]=useState(false);
    const [messageForToast,setmessageForToast]=useState("");



    const hideToast =  () => {
        setshowToast(false);
    }

    let onMessageReceived = (msg) => {
        console.log(msg);
        if(props.username=== msg.clientUsername ) {
             setmessageForToast(msg.finalMessage)
             setshowToast(true);
             console.log(msg);
        }

    }

    return (
        <>
            <Row>

                <Col>
                    <Card body className="cardA" style={{ width: '30rem' }}>
                        welcome {props.username} .
                    </Card>
                </Col>

                <Col md={7} className="mb-2">

                        <Toast show={showToast} onClose={hideToast} animation={false} delay={10000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">Success.</strong>
                                <small>1 sec ago</small>
                            </Toast.Header>
                            <Toast.Body>{messageForToast}</Toast.Body>
                        </Toast>

                </Col>
            </Row>
            <SockJsClient
                url={SOCKET_URL}
                topics={['/topic/message']}
                onConnect={console.log("Connected!!")}
                onDisconnect={console.log("Disconnected!")}
                onMessage={msg => onMessageReceived(msg)}
                debug={false}
            />

        </>
    );
};

export default CustomerView;