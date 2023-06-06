import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';

export default function MessageBody() {
    const token = sessionStorage.getItem("token");
    const chatData = useSelector((state: RootState) => state.chat)
    const authData = useSelector((state: RootState) => state.auth)
    const [messages, setMessages] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState("");

    const sendMessage = () => {
        fetch("http://localhost:5000/chatbook/chat/sendMessage", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatId: chatData.chatId,
                senderId: authData.user_id,
                message: inputMessage
            })
        })
            .then((e) => e.json())
            .then((e) => {
                console.log(e);
            })
            .catch((err) => console.log(err))
    }

    const getAllChatMessage = () => {
        fetch("http://localhost:5000/chatbook/chat/getAllChatMessages", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatId: chatData.chatId })
        })
            .then((e) => e.json())
            .then((e) => {
                setMessages(e.data);
            })
            .catch((err) => console.log(err))
    }

    const handleSendMessage = (e: any) => {
        e.preventDefault();
        if (inputMessage.trim() === "") return;
        sendMessage();
    }

    useEffect(() => {
        getAllChatMessage();
    }, [chatData.receiver.username])

    return (
        <div>
            <h1>{chatData.receiver.username}</h1>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {messages.map((msg: any) => {
                    return <span key={msg._id}>{msg.message}</span>
                })}
            </div>
            <form onSubmit={handleSendMessage}>
                <input type="text" onChange={(e) => setInputMessage(e.target.value)} />
            </form>
        </div>
    )
}
