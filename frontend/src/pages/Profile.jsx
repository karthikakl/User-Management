import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture, uploadResume } from '../features/auth/authSlice';
import Header from '../components/Header';
import axios from 'axios';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [file, setFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [profilePicture, setProfilePicture] = useState(user?.profilePicture ? `http://localhost:8000/images/${user.profilePicture}` : null);
    const [resumeFile, setResumeFile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingResume, setLoadingResume] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState({ profilePicture: false, resume: false });
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [showResumeSaveButton, setShowResumeSaveButton] = useState(false);  // New state for showing resume save button

    useEffect(() => {
        if (user && user.token) {
            const fetchProfileData = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/users/profile', {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });

                    setProfilePicture(response.data.profilePicture ? `http://localhost:8000/images/${response.data.profilePicture}` : null);
                    setResumeFile(response.data.resume);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                    setError('Failed to fetch profile data.');
                    setLoading(false);
                }
            };

            fetchProfileData();
        }
    }, [user]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type.startsWith("image/")) {
                setFile(selectedFile);
                setProfilePicture(URL.createObjectURL(selectedFile));
                setShowSaveButton(true);
                setUploadSuccess(prev => ({ ...prev, profilePicture: false }));
            } else {
                alert("Please select an image file.");
            }
        }
    };

    const handleResumeChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setResume(selectedFile);
            setShowResumeSaveButton(true);  // Show resume save button when file is selected
            setUploadSuccess(prev => ({ ...prev, resume: false }));
        }
    };

    const handleUploadProfilePicture = async () => {
        if (!file) {
            alert('Please select a profile picture to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoadingProfile(true);
        try {
            const response = await axios.post('http://localhost:8000/api/users/uploadProfilePicture', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.data.profilePicture) {
                dispatch(updateProfilePicture({ profilePicture: response.data.profilePicture }));
                setProfilePicture(`http://localhost:8000/images/${response.data.profilePicture}`);
                setUploadSuccess(prev => ({ ...prev, profilePicture: true }));
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture.');
        } finally {
            setLoadingProfile(false);
            setShowSaveButton(false);
        }
    };

    const handleUploadResume = async () => {
        if (!resume) {
            alert('Please select a resume to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', resume);

        setLoadingResume(true);
        try {
            const response = await axios.post('http://localhost:8000/api/users/uploadResume', formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.data.resume) {
                dispatch(uploadResume({ resume: response.data.resume }));
                setResumeFile(response.data.resume);
                setUploadSuccess(prev => ({ ...prev, resume: true }));
            }
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to upload resume.');
        } finally {
            setLoadingResume(false);
            setShowResumeSaveButton(false);  // Hide resume save button after upload
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <Header />
            <div className="profile-container">
                <h2>User Profile</h2>
                {user ? (
                    <div className="profile-details">
                        {/* Profile Picture Section */}
                        <div className="profile-picture-container">
                            <img
                                src={profilePicture || 'default-profile.jpg'}
                                alt="Profile"
                                className="profile-picture-preview"
                            />
                            <div className="file-input-container">
                                <label htmlFor="profilePictureInput" className="file-input-label">
                                    Click to Select Profile Picture
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    id="profilePictureInput"
                                    className="file-input"
                                    hidden
                                />
                            </div>
                            {file && <p>Selected: {file.name}</p>}

                            {/* Success Message */}
                            {uploadSuccess.profilePicture && (
                                <p className="success-message">Profile picture uploaded successfully!</p>
                            )}

                            {/* Save Button */}
                            {showSaveButton && (
                                <button
                                    onClick={handleUploadProfilePicture}
                                    disabled={!file || loadingProfile}
                                >
                                    {loadingProfile ? 'Uploading Profile Picture...' : 'Save Profile Picture'}
                                </button>
                            )}
                        </div>

                        {/* Resume Section */}
                        <div className="resume-upload-container">
                            <div className="file-input-container">
                                <label htmlFor="resumeInput" className="file-input-label">
                                    Click to Select Resume
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeChange}
                                    id="resumeInput"
                                    className="file-input"
                                    hidden
                                />
                            </div>
                            {resume && <p>Selected: {resume.name}</p>}
                            {resumeFile && (
                                <div>
                                    <p>
                                        Current Resume: 
                                        <a 
                                            href={`http://localhost:8000/uploads/${resumeFile}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <button className="view-resume-button">
                                                <i className="fas fa-file-pdf"></i> View Resume
                                            </button>
                                        </a>
                                    </p>
                                </div>
                            )}

                            {/* Success Message for Resume Upload */}
                            {uploadSuccess.resume && (
                                <p className="success-message">Resume uploaded successfully!</p>
                            )}

                            {/* Save Button for Resume */}
                            {showResumeSaveButton && !uploadSuccess.resume && (
                                <button
                                    onClick={handleUploadResume}
                                    disabled={!resume || loadingResume}
                                >
                                    {loadingResume ? 'Uploading Resume...' : 'Save Resume'}
                                </button>
                            )}
                        </div>

                        {/* User Info */}
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
