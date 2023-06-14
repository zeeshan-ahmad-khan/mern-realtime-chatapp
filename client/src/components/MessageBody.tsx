import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store';
import { io } from 'socket.io-client';
import { Avatar, Box, Button, Center, Divider, Flex, FormControl, HStack, Input, Spinner, Stack, Text } from '@chakra-ui/react';
import { OutletContext } from '../pages/ChatBody';

export default function MessageBody() {
    const token = sessionStorage.getItem("token");
    const chatData = useSelector((state: RootState) => state.chat)
    const authData = useSelector((state: RootState) => state.auth)
    const [messages, setMessages] = useState<any>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const viewRef = useRef<any>(null);
    const socket = useContext(OutletContext);

    console.log(messages, "ddd");

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
                socket?.current.emit("send-message", chatData.chatId)
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
        if (!isLoading) {
            viewRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatData.chatId])

    useEffect(() => {
        socket.current.on("get-messages", (data: any) => {
            if (data.chatId === chatData.chatId) {
                getAllChatMessage()
            }
        })
    }, [socket])

    return (
        <Box ml="-2">
            <Stack>
                <HStack py="3" backgroundColor="#A7ECEE">
                    <Avatar size={"sm"} name={chatData.receiver.username} />
                    <Text>{chatData.receiver.username}</Text>
                </HStack>
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
                    : <Stack height="sm" overflowY="scroll" px="2">
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
                        <Box className='empty-div' ref={viewRef}></Box>
                    </Stack>}
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
