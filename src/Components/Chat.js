import "./Chat.css";
import {Card} from "react-bootstrap";
import React from "react";

function ChatLine({ chat }) {
    return (
            <div className={chat?.mine ? "chatline chatline-mine" : "chatline chatline-friend"}>
                <div className="chatline-msg">
                    <span>{chat?.msg}</span>
                </div>
            </div>

    );
}

export default function Chat({ msgList, sendMessage }) {
    function handleClick() {
        var msg = window.msgTextArea.value;
        sendMessage(msg);
        window.msgTextArea.value = "";
    }

    return (
        <>
            <div className="chat-list">
                {msgList?.map((chat, i) => (
                    <ChatLine chat={chat} key={i} />
                ))}
            </div>
            <div className="chat-input">
                <div style={{ flex: "3 1 90%" }}>
                    <textarea id="msgTextArea" />
                </div>
                <Card body className="cardA" style={{ width: '10rem'}} onClick={handleClick}>Send</Card>
            </div>
        </>
    );
}
