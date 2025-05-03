import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ADMIN_COLORS } from "../../styles/theme";
import { 
  LayoutGrid, 
  Map, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell, 
  Search,
  TrendingUp,
  UserCheck,
  MapPin,
  Calendar
} from "lucide-react";

// Import admin components
import AdminStats from "../../components/admin/AdminStats";
// import RecentBookings from "../../components/admin/RecentBookings";
// import PopularDestinations from "../../components/admin/PopularDestinations";
// import AdminCalendar from "../../components/admin/AdminCalender";


export default function HomeAdmin() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // Redirect to admin login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/adminLogin");
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ backgroundColor: ADMIN_COLORS.bg }} className="flex min-h-screen">
      {/* Sidebar */}
      <aside 
        style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }}
        className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo */}
        <div 
          style={{ borderColor: ADMIN_COLORS.border }} 
          className="flex h-16 items-center justify-center border-b px-4"
        >
          <div className="flex items-center">
            <div style={{ backgroundColor: ADMIN_COLORS.accent }} className="h-8 w-8 rounded-md flex items-center justify-center">
              <span style={{ color: ADMIN_COLORS.cardBg }} className="font-bold">CT</span>
            </div>
            {sidebarOpen && (
              <span 
                style={{ color: ADMIN_COLORS.text }} 
                className="ml-2 text-lg font-semibold"
              >
                Celoura Travels
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <a 
                href="/admin/dashboard" 
                style={{ backgroundColor: ADMIN_COLORS.hoverBg, color: ADMIN_COLORS.accent }}
                className="flex items-center rounded-lg px-4 py-3 font-medium"
              >
                <LayoutGrid className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </a>
            </li>
            <li>
              <a 
                href="/admin/destinations" 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="flex items-center rounded-lg px-4 py-3 font-medium hover:bg-opacity-80"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = ADMIN_COLORS.hoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Map className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Destinations</span>}
              </a>
            </li>
            <li>
              <a 
                href="/admin/users" 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="flex items-center rounded-lg px-4 py-3 font-medium hover:bg-opacity-80"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = ADMIN_COLORS.hoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Users className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Users</span>}
              </a>
            </li>
            <li>
              <a 
                href="/admin/bookings" 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="flex items-center rounded-lg px-4 py-3 font-medium hover:bg-opacity-80"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = ADMIN_COLORS.hoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FileText className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Bookings</span>}
              </a>
            </li>
            <li>
              <a 
                href="/admin/settings" 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="flex items-center rounded-lg px-4 py-3 font-medium hover:bg-opacity-80"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = ADMIN_COLORS.hoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Settings</span>}
              </a>
            </li>
          </ul>
        </nav>

        {/* Admin Profile */}
        <div 
          style={{ borderColor: ADMIN_COLORS.border, color: ADMIN_COLORS.secondaryText }} 
          className="border-t p-4"
        >
          <div className="flex items-center">
            <div 
              style={{ backgroundColor: ADMIN_COLORS.accent }} 
              className="h-8 w-8 rounded-full flex items-center justify-center"
            >
              <span style={{ color: ADMIN_COLORS.cardBg }} className="text-sm font-medium">
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p style={{ color: ADMIN_COLORS.text }} className="text-sm font-medium">
                  {currentUser?.name || 'Admin User'}
                </p>
                <p className="text-xs">{currentUser?.email || 'admin@example.com'}</p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button 
              className="mt-4 flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium"
              style={{ 
                backgroundColor: 'transparent', 
                color: ADMIN_COLORS.secondaryText,
                border: `1px solid ${ADMIN_COLORS.border}`
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </button>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          style={{ backgroundColor: ADMIN_COLORS.hoverBg, color: ADMIN_COLORS.secondaryText }}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full flex items-center justify-center border"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`}
          />
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header 
          style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }} 
          className="flex h-16 items-center justify-between border-b px-6"
        >
          <h1 style={{ color: ADMIN_COLORS.text }} className="text-xl font-semibold">
            Dashboard
          </h1>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div 
              style={{ backgroundColor: ADMIN_COLORS.inputBg, borderColor: ADMIN_COLORS.border }} 
              className="relative hidden md:block"
            >
              <Search 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" 
              />
              <input
                type="text"
                placeholder="Search..."
                style={{ 
                  backgroundColor: ADMIN_COLORS.inputBg, 
                  color: ADMIN_COLORS.text, 
                  borderColor: ADMIN_COLORS.border 
                }}
                className="w-64 rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-1"
              />
            </div>

            {/* Notifications */}
            <button 
              style={{ backgroundColor: ADMIN_COLORS.inputBg, color: ADMIN_COLORS.secondaryText }}
              className="relative rounded-full p-2"
            >
              <Bell className="h-5 w-5" />
              <span 
                style={{ backgroundColor: ADMIN_COLORS.accent }} 
                className="absolute right-1 top-1 h-2 w-2 rounded-full"
              ></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AdminStats 
              icon={<TrendingUp className="h-6 w-6" />}
              title="Total Bookings"
              value="1,248"
              trend="+12.5%"
              trendUp={true}
            />
            <AdminStats 
              icon={<UserCheck className="h-6 w-6" />}
              title="Active Users"
              value="3,427"
              trend="+8.1%"
              trendUp={true}
            />
            <AdminStats 
              icon={<MapPin className="h-6 w-6" />}
              title="Destinations"
              value="126"
              trend="+3"
              trendUp={true}
            />
            <AdminStats 
              icon={<Calendar className="h-6 w-6" />}
              title="This Month"
              value="$48,289"
              trend="-4.3%"
              trendUp={false}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Bookings */}
            {/* <div className="lg:col-span-2">
              <RecentBookings />
            </div> */}

            {/* Popular Destinations */}
            {/* <div>
              <PopularDestinations />
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}