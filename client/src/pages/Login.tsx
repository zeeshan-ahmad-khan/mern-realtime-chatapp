import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../redux/slices/authSlice';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginData, setLoginData] = useState({
        credential: "",
        password: ""
    })

    const handleSubmit = (e: any) => {
        e.preventDefault();
        fetch("http://localhost:5000/chatbook/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        }).then((e) => e.json())
            .then((e) => {
                console.log(e);
                dispatch(setCurrentUser({ username: e.username, email: e.email, user_id: e.user_id }))
                sessionStorage.setItem("token", e.token)
                navigate(`/chatbook/${e.user_id}`);
            }).catch((err) => {
                console.log(err);
            })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input value={loginData.credential} type="text" onChange={(e) => {
                    setLoginData((prev) => {
                        return { ...prev, credential: e.target.value }
                    })
                }} />
                <input value={loginData.password} type="text" onChange={(e) => {
                    setLoginData((prev) => {
                        return { ...prev, password: e.target.value }
                    })
                }} />
                <button>Submit</button>
            </form>
        </div>
    )
}
