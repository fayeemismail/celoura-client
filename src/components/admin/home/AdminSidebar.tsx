import { ADMIN_COLORS } from "../../../styles/theme";
import {
  LayoutGrid, Map, Users, FileText, Settings, ChevronDown, LogOut,
  ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { handleAdminLogout } from "../../../redux/admin/authThunks";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(handleAdminLogout());
    navigate("/admin/login");
  };

  const navLinks = [
  { href: "/admin/home", label: "Dashboard", icon: <LayoutGrid /> },
  { href: "/admin/destinations", label: "Destinations", icon: <Map /> },
  { href: "/admin/all-users", label: "Users", icon: <Users /> },
  { href: "/admin/guide-requests", label: "Guide Applies", icon: <ClipboardList /> }, 
  { href: "/admin/bookings", label: "Bookings", icon: <FileText /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings /> },
];


  return (
    <aside
      style={{  borderColor: '#081028' }}
      className={`fixed inset-y-0 left-0 z-10 flex flex-col bg-[#081028] border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex h-16 items-center justify-center border-b px-4" style={{ borderColor: ADMIN_COLORS.border }}>
        <div className="flex items-center">
          <div style={{ backgroundColor: ADMIN_COLORS.accent }} className="h-8 w-8 rounded-md flex items-center justify-center">
            <span style={{ color: ADMIN_COLORS.cardBg }} className="font-bold">CT</span>
          </div>
          {sidebarOpen && <span className="ml-2 text-lg font-semibold" style={{ color: ADMIN_COLORS.text }}>Celoura Travels</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navLinks.map(({ href, label, icon }) => (
          <a
            key={label}
            href={href}
            style={{ color: ADMIN_COLORS.secondaryText }}
            className="flex items-center rounded-lg px-4 py-3 font-medium hover:bg-opacity-80"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = ADMIN_COLORS.hoverBg}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {icon}
            {sidebarOpen && <span className="ml-3">{label}</span>}
          </a>
        ))}
      </nav>

      {/* Admin Info */}
      <div className="border-t p-4" style={{ borderColor: ADMIN_COLORS.border, color: ADMIN_COLORS.secondaryText }}>
        <div className="flex items-center">
          <div style={{ backgroundColor: ADMIN_COLORS.accent }} className="h-8 w-8 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium" style={{ color: ADMIN_COLORS.cardBg }}>
              {currentAdmin?.name?.charAt(0) || "A"}
            </span>
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium" style={{ color: ADMIN_COLORS.text }}>
                {currentAdmin?.name || "Admin User"}
              </p>
              <p className="text-xs">{currentAdmin?.email || "admin@example.com"}</p>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center cursor-pointer rounded-lg py-2 text-sm font-medium"
            style={{ backgroundColor: 'transparent', color: ADMIN_COLORS.secondaryText, border: `1px solid ${ADMIN_COLORS.border}` }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </button>
        )}
      </div>

      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        style={{ backgroundColor: ADMIN_COLORS.hoverBg, color: ADMIN_COLORS.secondaryText }}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full flex items-center justify-center border"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
      </button>
    </aside>
  );
}
