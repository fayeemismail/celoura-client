import {
  LayoutGrid, Map, Compass, MessageSquare, CalendarDays,
  ChevronDown, LogOut, UserIcon
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { handleGuideLogout } from "../../redux/guide/authThunks";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentGuide } = useSelector((state: RootState) => state.guide);

  const navLinks = [
    { href: "/guide/home", label: "Dashboard", icon: <LayoutGrid /> },
    { href: "/guide/destinations", label: "Destinations", icon: <Map /> },
    { href: "/guide/explore", label: "Explore", icon: <Compass /> },
    { href: "/guide/messages", label: "Messages", icon: <MessageSquare /> },
    { href: "/guide/booking", label: "Bookings", icon: <CalendarDays /> },
    { href: "/guide/profile", label: "Profile", icon: <UserIcon /> },
  ];

  const handleLogout = () => {
    dispatch(handleGuideLogout());
    navigate("/guide/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 flex flex-col bg-[#111] border-r border-[#222] transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b border-[#222] px-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-[#09b86c]">
            <span className="font-bold text-black">GT</span>
          </div>
          {sidebarOpen && (
            <span className="ml-2 text-lg font-semibold text-white">Guide Portal</span>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navLinks.map(({ href, label, icon }) => (
          <Link
            key={label}
            to={href}
            className="flex items-center rounded-lg px-4 py-3 font-medium text-gray-300 hover:text-[#09b86c] hover:bg-[#222]"
          >
            <span className="flex-shrink-0">{icon}</span>
            {sidebarOpen && <span className="ml-3">{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t border-[#222] p-4 text-gray-300">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[#09b86c]">
            <span className="text-sm font-medium text-black">
              {currentGuide?.name?.charAt(0) || "G"}
            </span>
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {currentGuide?.name || "Guide User"}
              </p>
              <p className="text-xs">{currentGuide?.email || "guide@example.com"}</p>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center cursor-pointer rounded-lg py-2 text-sm font-medium hover:bg-[#222]"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </button>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full flex items-center justify-center border border-[#333] bg-[#222] text-white"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            sidebarOpen ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
