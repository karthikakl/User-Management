import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

function AddUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const formErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[6-9]\d{9}$/; // Phone number should start with 6, 7, 8, or 9

        if (!name) {
            formErrors.name = 'Name is required';
        }

        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!emailPattern.test(email)) {
            formErrors.email = 'Enter a valid email address';
        }

        if (!number) {
            formErrors.number = 'Phone number is required';
        } else if (!phonePattern.test(number)) {
            formErrors.number = 'Phone number must start with 6, 7, 8, or 9 and be exactly 10 digits';
        } else if (/^(\d)\1{9}$/.test(number)) { 
            formErrors.number = 'Phone number cannot contain all the same repeated digits';
        }

        if (!password) {
            formErrors.password = 'Password is required';
        } else if (password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(formErrors);
        console.log(formErrors); // Debug: log the errors
        return Object.keys(formErrors).length === 0; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await axios.post('http://localhost:8000/api/admin/addUser', 
                { name, email, number, password });
                navigate('/adminHome'); 
            } catch (error) {
                console.error('Error adding user:', error);
            }
        } else {
            console.log("Form validation failed"); // Debug: log if validation fails
        }
    };

    return (
        <div className="add-user-container">
            <AdminHeader />
            <div className="card">
                <h2 className="card-title">Add User</h2>
                <form onSubmit={handleSubmit} className="add-user-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            
                        />
                        {errors.name && <span className="error">{errors.name}</span>} 
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="number">Phone:</label>
                        <input
                            type="tel"
                            id="number"
                            className="form-control"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            
                        />
                        {errors.number && <span className="error">{errors.number}</span>} 
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            
                        />
                        {errors.password && <span className="error">{errors.password}</span>} 
                    </div>
                    <button type="submit" className="btn btn-submit">Add User</button>
                </form>
            </div>
        </div>
    );
}

export default AddUser;
