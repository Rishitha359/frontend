import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from './Pages/Login';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
