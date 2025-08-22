import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu, X } from "lucide-react";
import { AppDispatch, RootState } from "../../../redux/store";
import COLORS from "../../../styles/theme";
import { handleSignout } from "../../../redux/user/authThunks";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async() => {
    dispatch(handleSignout())
    
    navigate("/login");
  };

  const handleProfilePage = () => {
    navigate('/Profile')
  }

  return (
    <header style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="fixed top-0 left-0 w-full z-50 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 style={{ color: COLORS.accent }} onClick={(() => navigate('/'))} className="text-2xl cursor-pointer font-bold">Celoura Travels</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a  style={{ color: COLORS.accent }} onClick={() => navigate('/')} className="font-medium cursor-pointer">Home</a>
          <a  style={{ color: COLORS.secondaryText }} onClick={() => navigate('/destinations')} className="font-medium cursor-pointer hover:text-accent">Destinations</a>
          <a  style={{ color: COLORS.secondaryText }} onClick={() => navigate('/guides')} className="font-medium cursor-pointer hover:text-accent">Guides</a>
          <a  style={{ color: COLORS.secondaryText }} onClick={() => navigate('/booking')} className="font-medium cursor-pointer hover:text-accent">Bookings</a>
        </nav>

        {/* User Profile/Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="mr-4">
                <p style={{ color: COLORS.text }} onClick={handleProfilePage} className="font-medium cursor-pointer">
                  {currentUser?.name || "User"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                style={{ color: COLORS.secondaryText }}
                className="flex items-center hover:text-accent"
              >
                <LogOut className="h-5 cursor-pointer w-5" /> { 'Logout' }
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
              className="rounded-lg px-4 py-2 font-medium"
            >
              Log In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          style={{ color: COLORS.secondaryText }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: COLORS.cardBg }} className="md:hidden border-t border-gray-200 p-4">
          <nav className="flex flex-col space-y-4">
            <a  style={{ color: COLORS.accent }} onClick={()=> navigate('/')}  className="font-medium">Home</a>
            <a  style={{ color: COLORS.secondaryText }} onClick={()=> navigate('/destinations')} className="font-medium">Destinations</a>
            <a  style={{ color: COLORS.secondaryText }} onClick={()=> navigate('/guides')} className="font-medium">Guides</a>
            <a  style={{ color: COLORS.secondaryText }} onClick={()=> navigate('/')} className="font-medium">Saved</a>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                style={{ color: COLORS.secondaryText }}
                className="flex items-center font-medium"
              >
                <LogOut className="mr-2 h-5 w-5" /> Log Out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}