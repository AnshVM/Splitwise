import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import MainPage from './components/MainPage'
import SearchResults from './components/SearchResults'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {useEffect,useState} from 'react'


function App() {

  const navigate = useNavigate()
  const [query,setQuery] = useState()

  const isLoggedIn = useSelector(state => state.loginState.isLoggedIn)
  
  useEffect(()=>{
      if (isLoggedIn===false) {
          navigate('/login')
      }
  },[isLoggedIn])


  return (
        <Routes>
          <Route path='/signup' element={<Signup />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/search" element={<SearchResults query={query} setQuery={setQuery}/>}/>
          <Route path="/" element={<MainPage query={query} setQuery={setQuery}/>}/>
        </Routes>
  );
}

export default App;
