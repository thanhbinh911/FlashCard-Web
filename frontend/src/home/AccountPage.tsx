import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

function AccountPage() {
  const navigate = useNavigate();

  // Lấy username từ localStorage đã được lưu khi đăng nhập
  const username = localStorage.getItem('username') || 'User';

  // Email tạm thời sử dụng placeholder vì backend chưa trả về dữ liệu này
  const emailPlaceholder = `${username.toLowerCase()}@gmail.com`;

  const handleLogout = () => {
    // Xóa toàn bộ session và điều hướng về trang login
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="form-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <h2 className="page-title" style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>
            Personal Profile
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Tên đăng nhập */}
            <div className="form-group">
              <label className="control-label">Username</label>
              <input
                className="form-input"
                value={username}
                readOnly
                style={{ backgroundColor: '#f8f9fa', cursor: 'default' }}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="control-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={emailPlaceholder}
                readOnly
                style={{ backgroundColor: '#f8f9fa', cursor: 'default' }}
              />
            </div>

            {/* Mật khẩu */}
            <div className="form-group">
              <label className="control-label">Password</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  className="form-input"
                  type="password"
                  value="********"
                  readOnly
                  style={{ flex: 1, backgroundColor: '#f8f9fa' }}
                />
                <button
                  className="btn-outline"
                  style={{ padding: '0 15px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                  onClick={() => navigate('/change-password')}
                >
                  Change Password
                </button>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0.5rem 0' }} />

            {/* Các nút điều hướng */}
            <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => navigate('/flashcards')}
              >
                Back
              </button>
              <button
                className="btn"
                style={{ flex: 1, backgroundColor: '#e74c3c' }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountPage;