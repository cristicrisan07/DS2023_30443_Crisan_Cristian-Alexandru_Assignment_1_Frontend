import Chat from "./Chat";
import "./ChatPage.css";
import { ChatMessage, ReceiveMsgRequest, Empty } from "../output/chat_pb";
import { useEffect, useState } from "react";

export default function ChatPage(props) {
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {

        const messageRequest = new ReceiveMsgRequest();
        messageRequest.setUser(props.username);

        const chatStream = props.client.receiveMsg(messageRequest, {});
        chatStream.on("data", (response) => {
            const from = response.getFrom();
            const msg = response.getMsg();
            const time = response.getTime();

            if (from === props.username) {
                setMessageList((oldArray) => [
                    ...oldArray,
                    { from, msg, time, mine: true },
                ]);
            } else {
                setMessageList((oldArray) => [...oldArray, { from, msg, time }]);
            }
        });

        chatStream.on("status", function (status) {
            console.log(status.code, status.details, status.metadata);
        });

        chatStream.on("end", () => {
            console.log("Stream ended.");
        });
    }, []);

    function sendMessage(message) {
        const msg = new ChatMessage();
        msg.setMsg(props.username + ": " + message);
        msg.setFrom(props.username);
        msg.setTime(new Date().toLocaleString());

        props.client.sendMsg(msg, null, (err, response) => {
            console.log(response);
        });
    }

    return (
            <div className="chatpage-section">
                <Chat msgList={messageList} sendMessage={sendMessage} />
            </div>
    );
}