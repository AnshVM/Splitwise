import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import MainPage from './components/MainPage'
import SearchResults from './components/SearchResults'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { login } from './loginSlice'
import { io } from "socket.io-client";
import jwt_decode from 'jwt-decode'

let socket

function App() {

  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const accessToken = useSelector((state) => state.loginState.accessToken)
  useEffect(() => {
    axios.get('/api/user/')
      .then((res) => {
        const accessToken = res.data;
        dispatch(login({ isLoggedIn: true, accessToken }))
      })
      .catch(() => {
        navigate('/login')
      })
  }, [])

  useEffect(() => {
    if (accessToken) {
      const {id} = jwt_decode(accessToken)
      socket = io("/", {
        auth: {
          token: accessToken
        },
        query: {
          "userId": id
        }
      });
    }
  }, [accessToken])


  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<SearchResults query={query} setQuery={setQuery} />} />
      <Route path="/" element={<MainPage query={query} setQuery={setQuery} />} />
    </Routes>
  );
}

export {socket}
export default App
