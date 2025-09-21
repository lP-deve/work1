
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './components/userRegister/Register'
import Login from './components/login/Login'
import Home from './components/Store/Home'
import Protect from './components/userRegister/API/Protect'

function App() {


  return (
    <>

      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/store" element={<Protect> <Home /></Protect>}/>
      </Routes>
    </>
  )
}

export default App
