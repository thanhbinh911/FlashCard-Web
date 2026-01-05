import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/LoginPage.css';

function ChangePasswordPage() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }

        fetch('http://localhost:8080/api/auth/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        }).then((response) => {
            if (response.ok) {
                alert('Password changed successfully.');
                navigate('/account');
            } else {
                alert('Failed to change password.');
                console.error('Password change failed with status:', response.status);
            }
        });
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Change Password</h2>

                <form onSubmit={handleChangePassword} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword" className="form-label">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="form-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmNewPassword" className="form-label">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            className="form-input"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Change Password
                    </button>

                    <div className="auth-link">
                        <a href="/account">Back to Account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordPage;