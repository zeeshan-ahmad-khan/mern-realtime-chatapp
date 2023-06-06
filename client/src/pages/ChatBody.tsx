import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { setChatData } from '../redux/slices/chatSlice';
import { removeCurrentUser } from '../redux/slices/authSlice';


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
                // console.log(e);
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
        <>
            <button onClick={() => {
                sessionStorage.removeItem("persist:root");
                dispatch(removeCurrentUser());
                navigate("/login");
            }}>Sign Out</button>
            <main className='body'>
                <section>
                    <h1>{authData.username}</h1>
                    {users?.map((user) => {
                        const { _id, username } = user;
                        return <p key={_id} onClick={() => {
                            getChatDetails(_id, user)
                        }}>{username}</p>
                    })}
                </section>
                <Outlet />
            </main>
        </>
    )
}
