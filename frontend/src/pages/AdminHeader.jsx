import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css'; // Assuming you'll style it separately

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/adminLogin');
  };

  return (
    <header className="admin-header">
      <div className="header-title-container">
        <h1 className="admin-title">{title}</h1>
      </div>
      <div className="logout-container">
        <button className="btn btn-logout" onClick={adminLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
