import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const GuideNavbar = () => {
    const { currentGuide } = useSelector((state: RootState) => state.guide)
    return (
        <header className="fixed top-0 left-0 right-0 z-30 border-b border-[#1f1f20] bg-[#000] shadow-sm">
            <div className="flex items-center justify-between p-4 px-6">
                {/* Left side - Celoura */}
                <h1 className="text-[#d0b012]">Celoura</h1>

                {/* Center - Guide Portal */}
                <h1 className="text-xl font-bold text-[#09b86c] hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    Welcome - {currentGuide? currentGuide.name :  "User"}
                </h1>

                {/* Right side - Notification */}
                <div className="flex items-center space-x-4">
                    <button className="text-[#fff] hover:text-[#09b86c] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default GuideNavbar;