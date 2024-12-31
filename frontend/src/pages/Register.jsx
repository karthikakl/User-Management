import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        password: ''
    });

    const { name, email, number, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Validation function
    const validateForm = () => {
        const formErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10}$/; 

       
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
            formErrors.number = 'Phone number must be exactly 10 digits';
        } else if (/^(\d)\1{9}$/.test(number)) { 
            formErrors.number = 'Phone number cannot contain all the same repeated digits';
        } else if (!/^[6-9]\d{9}$/.test(number)) { 
            formErrors.number = 'Phone number must start with 6, 7, 8, or 9';
        }

       
        if (!password) {
            formErrors.password = 'Password is required';
        } else if (password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters long';
        }

        return formErrors;
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            const userData = {
                name,
                email,
                number,
                password,
            };
            
            dispatch(register(userData)); 
        } else {
            setErrors(formErrors); 
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <section>
                <h1><FaUser /> Register</h1>
                <p>Create an account</p>
            </section>
            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input type='text'
                            className='form-control'
                            id='name'
                            name='name'
                            value={name}
                            placeholder='Enter your name'
                            onChange={onChange} />
                        {errors.name && <p className='error' style={{ color: 'red' }}>{errors.name}</p>}

                        <input type='text'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Enter your email'
                            onChange={onChange} />
                        {errors.email && <p className='error' style={{ color: 'red' }}>{errors.email}</p>}

                        <input type='text'
                            className='form-control'
                            id='number'
                            name='number'
                            value={number}
                            placeholder='Enter your phone number'
                            onChange={onChange} />
                        {errors.number && <p className='error' style={{ color: 'red' }}>{errors.number}</p>}

                        <input type='password'
                            className='form-control'
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Enter your password'
                            onChange={onChange} />
                        {errors.password && <p className='error' style={{ color: 'red' }}>{errors.password}</p>}
                    </div>
                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>Submit</button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Register;
