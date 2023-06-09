import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { Box, Button, Center, Container, Flex, FormControl, FormLabel, HStack, Heading, Input, Stack, Text } from '@chakra-ui/react';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authData = useSelector((state: RootState) => state.auth);
    const [loginData, setLoginData] = useState({
        credential: "",
        password: ""
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const resp = await fetch("http://localhost:5000/chatbook/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            const e = await resp.json();
            if (e.success) {
                dispatch(setCurrentUser({ username: e.username, email: e.email, user_id: e.user_id }))
                sessionStorage.setItem("token", e.token)
                navigate(`/chatbook/${e.user_id}`);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (authData.user_id) {
            navigate(`/chatbook/${authData.user_id}`)
        }
    }, [])

    return (
        <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
            <Stack align="center">
                <Stack>
                    <Center flexDir="column" gap={2}>
                        <Heading as="h1">Login to your account</Heading>
                        <HStack>
                            <Text>Don't have an account?</Text>
                            <Text color='#9AC5F4'>
                                <Link to="/signup">
                                    Sign Up
                                </Link>
                            </Text>
                        </HStack>
                    </Center>
                </Stack>
                <Box
                    width="lg"
                    border={"1px solid #D2E9E9"}
                    backgroundColor="#E3F4F4"
                    borderRadius="lg"
                    p={"2rem 1rem"}
                >
                    <Stack maxW="100%">
                        <Stack>
                            <FormControl >
                                <FormLabel>Email / Username</FormLabel>
                                <Input backgroundColor="#f8f6f4" value={loginData.credential} type="text" onChange={(e) => {
                                    setLoginData((prev) => {
                                        return { ...prev, credential: e.target.value }
                                    })
                                }} placeholder='Enter email or username' />
                            </FormControl>
                        </Stack>
                        <Stack>
                            <FormLabel>Password</FormLabel>
                            <Input backgroundColor="#f8f6f4" value={loginData.password} type="text" onChange={(e) => {
                                setLoginData((prev) => {
                                    return { ...prev, password: e.target.value }
                                })
                            }} placeholder='Enter password' />
                        </Stack>
                        <Stack>
                            <Button backgroundColor='#9AC5F4' onClick={handleSubmit}>Submit</Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    )
}
