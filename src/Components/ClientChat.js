import "./ClientChat.css";

import { User, JoinResponse } from "./../output/chat_pb";
import { ChatServiceClient } from "../output/chat_grpc_web_pb";
import ChatPage from "./ChatPage";
import React, { useState, useRef } from "react";
import {Card} from "react-bootstrap";

export default function ClientChat(props) {

    const client = new ChatServiceClient("http://localhost:5000", null, null);
    const [joined, setJoined] = useState(null);

    function joinChat() {

        const user = new User();
        user.setId(Date.now());
        user.setName(props.username);

        client.join(user, null, (err, response) => {
            if (err) return console.log(err);
            const error = response.getError();
            const msg = response.getMsg();

            if (error === 1) {
                setJoined(true);
                return;
            }
            setJoined(true);
        });
    }

    return (
        <div className="chat-container">
            {joined ? <ChatPage client={client} username={props.username}/> : <Card body className="cardA" style={{ width: '30rem'}} onClick={joinChat}>Open Chat</Card>}
        </div>
    );
}