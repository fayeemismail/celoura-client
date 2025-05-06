import React, { useState } from 'react';
import { User, Edit, LogOut, Key, Eye, EyeOff, Check, X } from 'lucide-react';
import COLORS from '../../styles/theme';
import Navbar from '../../components/user/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';




const mockUser = {
  name: "John Smith",
  email: "john.smith@example.com"
};

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { currentUser, error, loading } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleSubmitEdit = () => {
    // Here you would submit the updated profile data to your API
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      ...formData,
      name: mockUser.name,
      email: mockUser.email
    });
    setIsEditing(false);
  };

  const handleTogglePassword = () => {
    setIsChangingPassword(!isChangingPassword);
    if (!isChangingPassword) {
      setIsEditing(false);
    } else {
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleSubmitPassword = () => {
    // Here you would validate and submit the new password to your API
    if (formData.password === formData.confirmPassword && formData.password.length >= 6) {
      console.log("Changing password");
      setIsChangingPassword(false);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } else {
      alert("Passwords must match and be at least 6 characters long");
    }
  };

  const handleLogout = () => {
    // Here you would implement your logout logic
    console.log("Logging out");
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      {/* Include your Navbar component here */}
      <Navbar />
      
      <div className="flex flex-col items-center pt-8 pb-16 px-4 max-w-3xl mx-auto w-full">
        <div className="w-full mb-8 flex justify-end">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 rounded"
            style={{ 
              backgroundColor: COLORS.accent, 
              color: '#FFFFFF'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div 
          className="w-full p-6 rounded-lg shadow-md"
          style={{ 
            backgroundColor: COLORS.cardBg,
            borderColor: COLORS.border,
            borderWidth: '1px'
          }}
        >
          {/* Profile Header with Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
              style={{ 
                backgroundColor: COLORS.border,
                color: COLORS.text
              }}
            >
              <User size={64} />
            </div>
            
            {!isEditing ? (
              <div className="text-center">
                <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>{mockUser.name}</h1>
                <p className="text-lg" style={{ color: COLORS.secondaryText }}>{mockUser.email}</p>
              </div>
            ) : (
              <div className="text-center w-full max-w-md">
                <div className="mb-4">
                  <label 
                    className="block mb-2 text-sm font-medium text-left"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded"
                    style={{ 
                      backgroundColor: COLORS.inputBg,
                      borderColor: COLORS.border,
                      borderWidth: '1px',
                      color: COLORS.text
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label 
                    className="block mb-2 text-sm font-medium text-left"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded"
                    style={{ 
                      backgroundColor: COLORS.inputBg,
                      borderColor: COLORS.border,
                      borderWidth: '1px',
                      color: COLORS.text
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Profile Actions */}
          <div className="flex flex-col space-y-4 max-w-md mx-auto">
            {!isEditing && !isChangingPassword ? (
              <button 
                onClick={handleEditProfile}
                className="flex items-center justify-center gap-2 px-4 py-2 w-full rounded"
                style={{ 
                  backgroundColor: COLORS.accent, 
                  color: '#FFFFFF'
                }}
              >
                <Edit size={16} />
                Edit Profile
              </button>
            ) : isEditing ? (
              <div className="flex gap-3">
                <button 
                  onClick={handleSubmitEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded"
                  style={{ 
                    backgroundColor: COLORS.accent, 
                    color: '#FFFFFF'
                  }}
                >
                  <Check size={16} />
                  Save
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded"
                  style={{ 
                    backgroundColor: '#F5F5F5', 
                    color: '#333333'
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            ) : null}

            {!isChangingPassword ? (
              <button 
                onClick={handleTogglePassword}
                className={`flex items-center justify-center gap-2 px-4 py-2 w-full rounded ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isEditing}
                style={{ 
                  backgroundColor: isEditing ? '#CCCCCC' : COLORS.inputBg,
                  borderColor: COLORS.border,
                  borderWidth: '1px',
                  color: COLORS.text
                }}
              >
                <Key size={16} />
                Change Password
              </button>
            ) : (
              <div className="w-full">
                <div className="mb-4">
                  <label 
                    className="block mb-2 text-sm font-medium"
                    style={{ color: COLORS.secondaryText }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pr-10 rounded"
                      style={{ 
                        backgroundColor: COLORS.inputBg,
                        borderColor: COLORS.border,
                        borderWidth: '1px',
                        color: COLORS.text
                      }}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ color: COLORS.secondaryText }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label 
                    className="block mb-2 text-sm font-medium"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pr-10 rounded"
                      style={{ 
                        backgroundColor: COLORS.inputBg,
                        borderColor: COLORS.border,
                        borderWidth: '1px',
                        color: COLORS.text
                      }}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ color: COLORS.secondaryText }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSubmitPassword}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded"
                    style={{ 
                      backgroundColor: COLORS.accent, 
                      color: '#FFFFFF'
                    }}
                  >
                    <Check size={16} />
                    Update Password
                  </button>
                  <button 
                    onClick={handleTogglePassword}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded"
                    style={{ 
                      backgroundColor: '#F5F5F5', 
                      color: '#333333'
                    }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;