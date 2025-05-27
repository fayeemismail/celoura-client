import { Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import COLORS from '../../../styles/theme';
import { SERIF_FONTS } from '../../../styles/font';
import { handleSignout } from '../../../redux/user/authThunks';

const ProfileNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleNavigateHome = () => {
        navigate('/');  
    };

    const handleLogout = () => {
        dispatch(handleSignout());

        navigate('/login')
    }

    return (
        <header
            style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
            className="fixed top-0 left-0 w-full z-50 border-b shadow-sm"
        >
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo / App Name */}
                <div className="flex items-center">
                    <h1
                        style={{ color: COLORS.accent }}
                        className="text-2xl font-bold cursor-pointer"
                        onClick={handleNavigateHome}
                    >
                        Celoura Travels
                    </h1>
                </div>

                {/* Center Title - Profile */}
                <div className="hidden md:flex items-center">
                    <h2
                        style={{
                            color: COLORS.accent,
                            fontFamily: SERIF_FONTS.accent,
                            fontSize: SERIF_FONTS.sizes.md,
                            fontWeight: SERIF_FONTS.weights.medium,
                        }}
                        className="text-lg font-medium">
                        Profile
                    </h2>
                </div>

                {/* User Info Display */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <button
                                onClick={handleNavigateHome}
                                style={{ color: COLORS.secondaryText }}
                                className="mr-4 flex items-center hover:text-accent"
                            >
                                <Home className="h-5 w-5 mr-1" />
                                <span className="hidden md:inline">Home</span>
                            </button>
                            <button
                                  onClick={handleLogout}
                                style={{ color: COLORS.secondaryText }}
                                className="flex items-center font-medium"
                            >
                                <LogOut className="mr-2 h-5 w-5" /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ProfileNavbar;