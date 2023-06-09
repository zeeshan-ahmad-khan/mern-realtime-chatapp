import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { removeCurrentUser } from '../redux/slices/authSlice';

export default function ChatHeader() {
    const navigate = useNavigate();
    const authData = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    return (
        <Box backgroundColor="#99DBF5">
            <Flex align="center" justify="space-between" px="1rem" py="0.5rem">
                <Heading as="h3">Chatbook</Heading>
                <Button backgroundColor='#FFEEBB' onClick={() => {
                    sessionStorage.removeItem("persist:root");
                    dispatch(removeCurrentUser());
                    navigate("/login");
                }}>Sign Out</Button>
            </Flex>
        </Box>
    )
}
