import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from './Pages/Login';
import Home from './Pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import TrainingDetails from './Components/TrainingDetails';
import AddTrainings from './Pages/AddTrainings';

function App() {

  const auth = localStorage.getItem('token');

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login/>}></Route>
    <Route path='/home' element={auth? <Home/> : <Login/>}></Route>
    <Route path='/viewTraining' element={auth? <TrainingDetails/> : <Login/>}></Route>
    <Route path='/addTraining' element={auth? <AddTrainings/> : <Login/>}></Route>
   </Routes>
   </BrowserRouter>
  );
}

export default App;
