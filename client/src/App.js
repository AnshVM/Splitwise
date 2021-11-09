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

function App() {

  const [query, setQuery] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()

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


  return (
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<SearchResults query={query} setQuery={setQuery} />} />
      <Route path="/" element={<MainPage query={query} setQuery={setQuery} />} />
    </Routes>
  );
}

export default App;
