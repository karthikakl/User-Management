import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    const validateForm = () => {
        const formErrors = {};
        
        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            formErrors.email = 'Enter a valid email address';
        }

        if (!password) {
            formErrors.password = 'Password is required';
        } else if (password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters long';
        }

        return formErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/admin/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/adminHome');
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <form className="login-form" onSubmit={handleLogin}>
            <h2 className="login-title">Admin Login</h2>
            <div className="form-group">
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error-message" style={{ color: 'red' }}>{errors.email}</p>}
            </div>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="error-message" style={{ color: 'red' }}>{errors.password}</p>}
            </div>
            <button type="submit" className="btn btn-primary login-btn">Login</button>
        </form>
    );
}

export default AdminLogin;
