import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Menu, X } from "lucide-react";
import { AppDispatch, RootState } from "../../redux/store";
import COLORS from "../../styles/theme";
import { handleSignout } from "../../redux/user/authThunks";

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
    <header style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="sticky top-0 z-10 border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 style={{ color: COLORS.accent }} className="text-2xl font-bold">Celoura Travels</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" style={{ color: COLORS.accent }} className="font-medium">Home</a>
          <a href="#" style={{ color: COLORS.secondaryText }} className="font-medium hover:text-accent">Destinations</a>
          <a href="#" style={{ color: COLORS.secondaryText }} className="font-medium hover:text-accent">Guides</a>
          <a href="#" style={{ color: COLORS.secondaryText }} className="font-medium hover:text-accent">Saved</a>
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
                <LogOut className="h-5 w-5" /> { 'Logout' }
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
            <a href="#" style={{ color: COLORS.accent }} className="font-medium">Home</a>
            <a href="#" style={{ color: COLORS.secondaryText }} className="font-medium">Destinations</a>
            <a href="#" style={{ color: COLORS.secondaryText }} className="font-medium">Guides</a>
            <a href="#" style={{ color: COLORS.secondaryText }} className="font-medium">Saved</a>
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