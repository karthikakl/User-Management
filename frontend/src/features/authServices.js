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
        console.error('Error during login:', error); 
        throw error; 
    }
};

// const fetchProfile = async (token)=>{
//     try{
//         const response = await axios.get(API_URL + '/profile',{
//             headers:{
//                 Authorization:`Bearer ${token}`,
//             }
//         })
//         return response.data;
//     }catch(error){
//         console.error('Error fetching profile:',error);
//         throw error
//     }
// }
const uploadProfilePicture = async(file,token)=>{
    const formData = new FormData()
    formData.append('file',file)
    try {
        const response = await axios.post(API_URL + '/uploadProfilePicture',formData,{
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'multipart/form-data',

          }  
        })
        return response.data
    } catch (error) {
       console.error('Error uploading profile picture:',error);
       throw error; 
    }
}

const uploadResume = async (file,token)=>{
    const formData = new FormData();
    formData.append('file',file)

    try {
        const response = await axios.post(API_URL + '/uploadResume',formData,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type' : 'multipart/form-data'
            }
        })
        return response.data
    } catch (error) {
        console.error('Error uploading resume:', error);
        throw error; 
    }
}
//Logout user
const logout=()=>{
   localStorage.removeItem('user') 
}

const authService = {
    register,
    login,
    logout,
    uploadProfilePicture,
    uploadResume,
    // fetchProfile
};

export default authService;
