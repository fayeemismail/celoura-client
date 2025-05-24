import { ADMIN_COLORS } from "../../../styles/theme";
import { Search, Bell } from "lucide-react";

export default function AdminHeader() {
  return (
    <header 
      style={{ backgroundColor: '#081028', borderColor: ADMIN_COLORS.border }} 
      className="flex h-16 items-center justify-between border-b px-6"
    >
      <h1 style={{ color: ADMIN_COLORS.text }} className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div 
          style={{ backgroundColor: "#081028", borderColor: ADMIN_COLORS.border }} 
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
              backgroundColor: "#0B1739", 
              color: ADMIN_COLORS.text, 
              borderColor: ADMIN_COLORS.border 
            }}
            className="w-64 rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-1"
          />
        </div>

        {/* Notifications */}
        <button 
          style={{ backgroundColor: "#0B1739", color: ADMIN_COLORS.secondaryText }}
          className="relative rounded-full p-2"
        >
          <Bell className="h-5 w-5" />
          <span 
            style={{ backgroundColor: ADMIN_COLORS.accent }} 
            className="absolute right-1 top-1 h-2 w-2 rounded-full"
          />
        </button>
      </div>
    </header>
  );
}
