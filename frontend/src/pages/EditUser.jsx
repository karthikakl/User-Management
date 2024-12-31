import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

function EditUser() {
    const { userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/admin/getUser/${userId}`);
                const user = response.data;

                if (user) {
                    setName(user.name);
                    setEmail(user.email);
                    setNumber(user.number);
                } else {
                    console.error('User data not found');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [userId]);

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

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await axios.put(`http://localhost:8000/api/admin/editUser/${userId}`, 
                { name, email, number });
                navigate('/adminHome'); // Redirect to admin home after updating user
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    return (
        <div className="edit-user-container">
            <AdminHeader />
            <div className="card">
                <h2 className="card-title">Edit User</h2>
                <form onSubmit={handleSubmit} className="edit-user-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <span className="error">{errors.name}</span>} {/* Error message */}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <span className="error">{errors.email}</span>} {/* Error message */}
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
                        {errors.number && <span className="error" >{errors.number}</span>} 
                    </div>
                    <button type="submit" className="btn btn-submit">Update User</button>
                </form>
            </div>
        </div>
    );
}

export default EditUser;
