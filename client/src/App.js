import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'

function App() {
  return (
      <Router>
        <Routes>
          <Route path='/signup' element={<Signup />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </Router>
  );
}

export default App;
