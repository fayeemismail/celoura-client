import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function DestinationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.admin)

  // const getDestinations = async () => {
  //   try {
      
  //   } catch (error) {
      
  //   }
  // }

  useEffect(() => {
    if(!isAuthenticated) navigate('/admin/login')
  }, [isAuthenticated])

  return (
    <div style={{ backgroundColor: "rgb(8 16 40)" }} className="flex min-h-screen">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-bold">Destinations</h2>
            <button
              onClick={() => navigate("/admin/create-destinations")}
              className="bg-[#111c36] text-white px-4 py-2 rounded hover:bg-[#202137]"
            >
              Create Destination
            </button>
          </div>

          <div className="bg-[#242A38] p-6 rounded shadow">
            {/* Placeholder for destination listing */}
            <p className="text-white">No destinations available. Add one to get started.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
