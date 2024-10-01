import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './Pages/Login';
import Home from './Pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const auth = localStorage.getItem('token');
  
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}></Route>
    <Route path='/home' element={auth? <Home/> : <Login/>}></Route>
   </Routes>
   </BrowserRouter>
  );
}

export default App;
