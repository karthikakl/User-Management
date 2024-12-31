import React,{useEffect} from 'react';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        dispatch(reset()); // Reset any relevant state
    };

    useEffect(()=>{
      if(!user){
        navigate('/')
      }
    },[user,navigate])

    return (
        <header className='header'>
          <h3>User side</h3>
            <ul className='nav-list'>
              
                {user ? (
                    <>
                        <li className='nav-item'>
                            <Link to='/profile' className='nav-link'>
                                <FaUser /> Profile
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <button onClick={handleLogout} className='btn'>
                                <FaSignOutAlt /> Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li className='nav-item'>
                        <Link to='/' className='nav-link'>
                            <FaSignInAlt /> Login/SignUp
                        </Link>
                    </li>
                )}
            </ul>
        </header>
    );
}

export default Header;
