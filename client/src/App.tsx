import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import ChatBody from './pages/ChatBody'
import MessageBody from './components/MessageBody';
import Home from './pages/Home';
import { io } from "socket.io-client";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/chatbook/:uid' element={<ChatBody />} >
        <Route path='chat/:chatId' element={<MessageBody />} />
      </Route>
    </Routes>
  )
}

export default App
