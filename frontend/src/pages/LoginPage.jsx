import { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    // Validation state
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess || user) {
            navigate('/home');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Client-side validation function
    const validateForm = () => {
        let formErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const onSubmit = (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length === 0) {
            const userData = { email, password };
            dispatch(login(userData));
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
                <h1><FaSignInAlt />Login</h1>
                <p>Create an account</p>
            </section>
            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='text'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Enter your email'
                            onChange={onChange}
                        />
                        {errors.email && <p className='error'>{errors.email}</p>}

                        <input
                            type='password'
                            className='form-control'
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Enter your password'
                            onChange={onChange}
                        />
                        {errors.password && <p className='error'>{errors.password}</p>}
                    </div>
                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>Login</button>
                    </div>
                </form>
                <p>
                    Don't have an account?{' '}
                    <button onClick={() => navigate('/register')}
                        style={{
                            color: '#2ecc71',
                            fontWeight: 'bold',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                        Sign Up
                    </button>
                </p>
            </section>
        </>
    );
}

export default Login;
