import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { Avatar, Box, Button, Center, Divider, Flex, FormControl, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { OutletContext } from '../pages/ChatBody';

export default function MessageBody() {
    const token = sessionStorage.getItem("token");
    const chatData = useSelector((state: RootState) => state.chat)
    const authData = useSelector((state: RootState) => state.auth)
    const [messages, setMessages] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [typingUser, setTypingUser] = useState("");
    const viewRef = useRef<any>(null);
    const timerRef = useRef<any>(null);
    const socket = useContext(OutletContext);

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
            .then((_) => {
                setMessages((prev: any) => {
                    return [...prev, {
                        chatId: chatData.chatId,
                        senderId: authData.user_id,
                        message: inputMessage
                    }]
                })
                socket.current.emit("sendMessage", {
                    chatId: chatData.chatId,
                    senderId: authData.user_id,
                    message: inputMessage
                })
                setInputMessage("");
                viewRef.current?.scrollIntoView({ behavior: "smooth" })
            })
            .catch((err) => console.log(err))
    }

    const getAllChatMessage = () => {
        setIsLoading(true)
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
                setIsLoading(false);
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
        getAllChatMessage();
    }, [chatData.receiver.username])

    useEffect(() => {
        socket.current.on("typing", (data: any) => {
            setTypingUser(data.username)
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setTypingUser("")
            }, 1500)
        })
        socket.current.on("receiveMessage", (data: any) => {
            console.log(data, authData.username);
        })
    }, [])

    // console.log(messages, "fff");

    return (
        <Box ml="-2">
            <Stack>
                <HStack py="3" backgroundColor="#A7ECEE">
                    <Avatar size={"sm"} name={chatData.receiver.username} />
                    <Text>{chatData.receiver.username}</Text>
                </HStack>
                <Box height="sm">
                    {isLoading ?
                        <Flex align="center" justify="center">
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        </Flex>
                        : <Stack maxHeight="100%" overflowY="scroll" px="2">
                            {messages.map((msg: any) => {
                                return <React.Fragment key={msg._id}>
                                    {authData.user_id === msg.senderId ?
                                        <Flex justify="flex-end">
                                            <Text wordBreak="break-word" backgroundColor="orange.300" p={"1.5"} borderRadius={10}>{msg.message}</Text>
                                        </Flex> :
                                        <Flex>
                                            <Text backgroundColor="green.300" p={"1.5"} borderRadius={10}>{msg.message}</Text>
                                        </Flex>
                                    }
                                </React.Fragment>
                            })}
                            <div className='empty-div' ref={viewRef}></div>
                        </Stack>}
                </Box>
                <FormControl position="fixed" bottom={0} mb="3">
                    <HStack width={"73%"}>
                        <Input value={inputMessage} placeholder={typingUser !== "" ? `${typingUser} is typing...` : 'Type message here...'} type="text" onChange={(e) => {
                            setInputMessage(e.target.value)
                            socket.current.emit("user-typing", {
                                username: authData.username
                            })
                        }} backgroundColor="#f8f6f4" />
                        <Button onClick={handleSendMessage}>Send</Button>
                    </HStack>
                </FormControl>
            </Stack>
        </Box>
    )
}
