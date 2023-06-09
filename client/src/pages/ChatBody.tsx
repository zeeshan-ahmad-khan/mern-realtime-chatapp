import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { setChatData } from '../redux/slices/chatSlice';
import { removeCurrentUser } from '../redux/slices/authSlice';
import { Avatar, Box, Center, Container, HStack, Heading, Stack, Text } from '@chakra-ui/react';
import ChatHeader from '../components/ChatHeader';

export default function ChatBody() {
    const navigate = useNavigate();
    const authData = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { uid } = useParams();
    const token = sessionStorage.getItem("token")
    const [users, setUsers] = useState([]);

    function getAllUsers() {
        fetch("http://localhost:5000/chatbook/auth/getAllUsers", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((e) => e.json())
            .then((e) => {
                const newUser = e.users.filter((user: any) => user.username !== authData.username)
                setUsers(newUser);
            })
            .catch((err) => console.log(err))
    }

    const getChatDetails = (id: string, user: any) => {
        fetch("http://localhost:5000/chatbook/chat/getChatData", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderId: uid,
                receiverId: id
            })
        })
            .then((e) => e.json())
            .then((e) => {
                dispatch(setChatData({
                    chatId: e.chatData._id,
                    receiver: user
                }))
                navigate(`/chatbook/${uid}/chat/${e.chatData._id}`)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (authData.user_id === "") {
            navigate("/login");
        }
        getAllUsers();
    }, [])

    return (
        <Box>
            <ChatHeader />
            <HStack align="flex-start" justify="space-between">
                <Box flex={1}>
                    <Stack>
                        <Stack py="3" backgroundColor="#A7ECEE">
                            <Center>Hello, {authData.username}</Center>
                            <Center fontSize="xs">Click on the usename to start the chat!</Center>
                        </Stack>
                        <Stack height="md" overflowY="scroll">
                            {users?.map((user) => {
                                const { _id, username } = user;
                                return <HStack cursor="pointer" key={_id} my="1" px="3">
                                    <Avatar name={username} size="sm" />
                                    <Text onClick={() => {
                                        getChatDetails(_id, user)
                                    }}>{username}</Text>

                                </HStack>
                            })}
                        </Stack>
                    </Stack>
                </Box>
                <Box flex={3}>
                    <Outlet />
                </Box>
            </HStack>
        </Box >
    )
}
