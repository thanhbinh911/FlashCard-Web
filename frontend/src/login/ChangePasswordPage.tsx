import React from 'react'
import { useNavigate } from 'react-router-dom';


function ChangePasswordPage() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match!");
            return;
        }
        fetch('http://localhost:8080/api/auth/password', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({currentPassword,newPassword})
        })
        .then(response => {
            if (response.ok) {
                alert("Password changed successfully.");
                console.log("Password change successful");
                navigate('/account');
            } else {
                alert("Failed to change password.");
                console.error("Password change failed with status:", response.status);
            }
        });
    }

  return (
    <div className='change-pass'>
        <h2>Change Password Page</h2>
        <form onSubmit={handleChangePassword} className='change-pass-form'>
            <div className='form-group'>
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className='form-group'>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className='form-group'>
                <label>Confirm New Password</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
            <button type="submit">Change Password</button>
        </form>
    </div>
  )
}

export default ChangePasswordPage