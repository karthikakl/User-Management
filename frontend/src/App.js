import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Login from './pages/LoginPage'
import Home from './pages/Home'
import AdminLogin from './pages/adminLogin'
import AdminHome from'./pages/adminHome'
import AddUser from './pages/AddUser'
import EditUser from './pages/EditUser'

function App() {
  return (
    <>
    <Router>
    <div className='container'>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/adminLogin' element={<AdminLogin/>}></Route>
        <Route path='/adminHome' element={<AdminHome/>}></Route>
        <Route path='/addUser' element={<AddUser/>}></Route>
        <Route path='/editUser/:userId' element={<EditUser/>}></Route>
      </Routes>
    </div>
    </Router>
    <ToastContainer/>
    </>
      );
}

export default App;
