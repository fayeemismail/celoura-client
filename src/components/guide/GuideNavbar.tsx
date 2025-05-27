import { Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { GUIDE_COLORS } from '../../styles/theme';
import { handleGuideLogout } from '../../redux/guide/authThunks';

const GuideNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleNavigateHome = () => {
        navigate('/guide/home');  
    };

    const handleLogout = () => {
        dispatch(handleGuideLogout());
        navigate('/guide/login');
    };

    return (
        <header
            style={{ 
                backgroundColor: GUIDE_COLORS.cardBg, 
                borderColor: GUIDE_COLORS.border 
            }}
            className="fixed top-0 left-0 w-full z-50 border-b shadow-sm"
        >
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo / App Name */}
                <div className="flex items-center">
                    <h1
                        style={{ color: GUIDE_COLORS.accent }}
                        className="text-2xl font-bold cursor-pointer"
                        onClick={handleNavigateHome}
                    >
                        Celoura Travels
                    </h1>
                </div>

                {/* Center Title - Guide Portal */}
                <div className="hidden md:flex items-center">
                    <h2
                        style={{
                            color: GUIDE_COLORS.accent,
                            fontSize: '1.125rem',
                            fontWeight: 500,
                        }}
                        className="text-lg font-medium">
                        Guide Portal
                    </h2>
                </div>

                {/* Navigation Actions */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <button
                                onClick={handleNavigateHome}
                                style={{ color: GUIDE_COLORS.secondaryText }}
                                className="mr-4 flex items-center hover:text-accent"
                            >
                                <Home className="h-5 w-5 mr-1" />
                                <span className="hidden md:inline">Home</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{ color: GUIDE_COLORS.secondaryText }}
                                className="flex items-center font-medium cursor-pointer"
                            >
                                <LogOut className="mr-2 h-5 w-5 cursor-pointer" /> Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default GuideNavbar;