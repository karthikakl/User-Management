import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users'; 

const register = async (userData) => {
    try {
        const response = await axios.post(API_URL + '/register', userData);

        
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

const login = async (userData) => {
    try {
        const response = await axios.post(API_URL + '/login', userData);

        
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error); 
        throw error; 
    }
};

const uploadProfilePicture = async (userData) => {
    const user = JSON.parse(localStorage.getItem('user')); 
    const token = user ? user.token : null;
    try {
        const response = await axios.post(API_URL + '/uploadProfilePicture', userData, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error); 
        throw error; 
    }
};

//Logout user
const logout=()=>{
   localStorage.removeItem('user') 
}

const authService = {
    register,
    login,
    logout,
    uploadProfilePicture
};

export default authService;
