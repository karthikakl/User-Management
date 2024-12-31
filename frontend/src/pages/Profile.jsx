import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture } from '../features/auth/authSlice';
import Header from '../components/Header';
import axios from 'axios';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [file, setFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture ? `http://localhost:8000/images/${user.profilePicture}` : null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        return () => {
            if (profilePicture) {
                URL.revokeObjectURL(profilePicture);
            }
        };
    }, [profilePicture]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setProfilePicture(URL.createObjectURL(selectedFile)); 
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file); 
    
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/users/uploadProfilePicture', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    
                },
            });
    
            if (response.data.profilePicture) {
                dispatch(updateProfilePicture({ profilePicture: response.data.profilePicture }));
                setProfilePicture(`http://localhost:8000/images/${response.data.profilePicture}`);
                setFile(null); 
            }
    
            alert('Profile picture uploaded successfully!');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture.');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <Header />
            <div className="profile-container">
                <h2>User Profile</h2>
                {user ? (
                    <div className="profile-details">
                        <div className="profile-picture">
                            <img src={profilePicture || `http://localhost:8000/images/${user.profilePicture}`} alt="Profile" />
                            <input type="file" onChange={handleFileChange} />
                        </div>
                        <button onClick={handleUpload}>
                            {loading ? 'Uploading...' : 'Save Profile Picture'}
                        </button>
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <p>Email: {user.email}</p>
                        </div>
                    </div>
                ) : (
                    <p>Please log in to view your profile.</p>
                )}
            </div>
        </>
    );
};

export default Profile;
