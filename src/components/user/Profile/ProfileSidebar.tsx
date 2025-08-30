// /components/user/Profile/ProfileSidebar.tsx
import { 
  FaUser, FaMapMarkerAlt, 
  FaHeart, FaEdit, FaBookmark, FaSignOutAlt 
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { handleSignout } from "../../../redux/user/authThunks";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  active: string;
  setActive: (page: string) => void;
  user: any;
}

export default function ProfileSidebar({ active, setActive, user }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FaUser /> },
    { id: "edit-profile", label: "Edit Profile", icon: <FaEdit /> },
    { id: "addresses", label: "Addresses", icon: <FaMapMarkerAlt /> },
    { id: "followed-guides", label: "Followed Guides", icon: <FaBookmark /> },
    { id: "liked-posts", label: "Liked Posts", icon: <FaHeart /> },
  ];

  const handleLogout = () => {
    dispatch(handleSignout());
    navigate("/login");
  };

  return (
    <div className="w-72 bg-white border border-[#e0d8c3] rounded-lg shadow-md p-6 flex flex-col h-full">
      {/* User details at the top */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#f0ebe0] flex items-center justify-center text-[#8b7355] font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-[#8b7355] text-base">{user?.name || "User"}</p>
          <p className="text-sm text-gray-500">{user?.email || ""}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e0d8c3] mb-6"></div>

      {/* Navigation menu */}
      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 
              ${active === item.id ? "bg-[#f0ebe0] font-semibold text-[#8b7355]" : "hover:bg-[#f8f5ef] text-gray-700"}`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition mt-6"
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
}
