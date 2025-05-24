import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import AdminDashboardContent from "../../components/admin/home/AdminDashboard";
import { GetAllUsersData } from "../../redux/admin/authThunks";

export default function HomeAdmin() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState([]);
  const [guide, setGuide] = useState([]);

  const fetchAllUsersAndGuides = async () => {
    try {
      const response = await dispatch(GetAllUsersData());
      if (response.data) {
        setUsers(response.data.users);
        setGuide(response.data.guide);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    fetchAllUsersAndGuides();
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ backgroundColor: '#081028' }} className="flex min-h-screen">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <AdminHeader />
        <AdminDashboardContent users={users} guide={guide} />
      </main>
    </div>
  );
}
