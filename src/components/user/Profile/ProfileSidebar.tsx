// /components/user/Profile/ProfileSidebar.tsx
import { FaUser, FaSuitcase, FaMapMarkerAlt, FaHeart, FaEdit, FaBookmark } from "react-icons/fa";

interface SidebarProps {
  active: string;
  setActive: (page: string) => void;
}

export default function ProfileSidebar({ active, setActive }: SidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: <FaUser /> },
    { id: "bookings", label: "Bookings", icon: <FaSuitcase /> },
    { id: "edit-profile", label: "Edit Profile", icon: <FaEdit /> },
    { id: "addresses", label: "Addresses", icon: <FaMapMarkerAlt /> },
    { id: "followed-guides", label: "Followed Guides", icon: <FaBookmark /> },
    { id: "liked-posts", label: "Liked Posts", icon: <FaHeart /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-[#e0d8c3] rounded-l-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">My Account</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
              ${active === item.id ? "bg-[#f0ebe0] font-semibold" : "hover:bg-[#f8f5ef]"}`}
          >
            <span className="text-[#8b7355]">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
