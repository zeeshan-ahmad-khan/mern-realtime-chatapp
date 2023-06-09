import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { io } from 'socket.io-client';
import { Avatar, Box, Button, Center, Divider, Flex, FormControl, HStack, Input, Stack, Text } from '@chakra-ui/react';

export default function MessageBody() {
    const socket = io("http://localhost:5000");
    const token = sessionStorage.getItem("token");
    const chatData = useSelector((state: RootState) => state.chat)
    const authData = useSelector((state: RootState) => state.auth)
    const [messages, setMessages] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState("");
    const viewRef = useRef<any>(null);

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
                setInputMessage("");
                socket.emit("sent", e);
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
                viewRef.current?.scrollIntoView({ behavior: "smooth" })
            })
            .catch((err) => console.log(err))
    }

    const handleSendMessage = (e: any) => {
        e.preventDefault();
        if (inputMessage.trim() === "") return;
        sendMessage();
    }

    useEffect(() => {
        socket.on("sentAgain", (msg) => {
            console.log(msg);
            getAllChatMessage();
        })
        return () => { socket.off('sentAgain') };
    }, [socket])


    useEffect(() => {
        getAllChatMessage();
    }, [chatData.receiver.username])

    return (
        <Box ml="-2">
            <Stack>
                <HStack py="3" backgroundColor="#A7ECEE">
                    <Avatar size={"sm"} name={chatData.receiver.username} />
                    <Text>{chatData.receiver.username}</Text>
                </HStack>
                <Stack height="sm" overflowY="scroll" px="2">
                    {messages.map((msg: any) => {
                        return <React.Fragment key={msg._id}>
                            {authData.user_id === msg.senderId ? <Flex justify="flex-end">
                                <Text wordBreak="break-word" backgroundColor="orange.300" p={"1.5"} borderRadius={10}>{msg.message}</Text>
                            </Flex> :
                                <Flex>
                                    <Text backgroundColor="green.300" p={"1.5"} borderRadius={10}>{msg.message}</Text>
                                </Flex>
                            }
                            <div ref={viewRef}></div>
                        </React.Fragment>
                    })}
                </Stack>
                <FormControl position="fixed" bottom={0} mb="3">
                    <HStack width={"73%"}>
                        <Input value={inputMessage} placeholder='Type message here...' type="text" onChange={(e) => setInputMessage(e.target.value)} backgroundColor="#f8f6f4" />
                        <Button onClick={handleSendMessage}>Send</Button>
                    </HStack>
                </FormControl>
            </Stack>
        </Box>
    )
}
