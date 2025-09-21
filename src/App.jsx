
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Register from './components/userRegister/Register'
import Login from './components/login/Login'
import Home from './components/Store/Home'
import Protect from './components/userRegister/API/Protect'
import ProductDetail from './components/productDetails/ProductDetail'

function App() {


  return (
    <>

      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/store" element={<Protect> <Home /></Protect>}/>
        <Route path="/products/:id" element={<ProductDetail/>}/>
      </Routes>
    </>
  )
}

export default App
