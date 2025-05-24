import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { ApproveAsGuide, GetAllGuideApplications } from "../../redux/admin/authThunks";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";

interface requests {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  status: string;
  experience: string;
  expertise: string;
  dob: Date;
  address: string;
  idFileUrl: string;
  userId: string;
}

export default function GuideRequests() {
  const [guideApplies, setGuideApplies] = useState<requests[]>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const getGuideApplies = async () => {
    try {
      const response = await dispatch(GetAllGuideApplications());
      setGuideApplies(response.data);
    } catch (error) {
      console.error("Error fetching guide applications", error);
    }
  };

  const handleGuideApprove = async (requestId: string, userId: string) => {
    try {
      // console.log(data)
      await dispatch(ApproveAsGuide(requestId, userId))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGuideApplies();
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1F2C] flex">
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <AdminHeader />

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guideApplies?.map((Application) => (
              <div
                key={Application._id}
                className="bg-[#1D2436] border border-[#2D3345] rounded-xl shadow-sm p-6 hover:shadow-md transition flex flex-col"
              >
                {/* ID Photo at the top */}
                <div className="mb-4 flex justify-center">
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-[#2D3345]">
                    <img 
                      src={Application.idFileUrl} 
                      alt={`${Application.fullName}'s ID`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://via.placeholder.com/300x200?text=ID+Not+Available';
                      }}
                    />
                  </div>
                </div>

                {/* Application Details */}
                <div className="space-y-2 text-sm text-gray-200 flex-grow">
                  <p><span className="font-medium text-white">Name:</span> {Application.fullName}</p>
                  <p><span className="font-medium text-white">Email:</span> {Application.email}</p>
                  <p><span className="font-medium text-white">Phone:</span> {Application.phone}</p>
                  <p><span className="font-medium text-white">Experience:</span> {Application.experience}</p>
                  <p><span className="font-medium text-white">Expertise:</span> {Application.expertise}</p>
                  <p><span className="font-medium text-white">Address:</span> {Application.address}</p>
                  <p>
                    <span className="font-medium text-white">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                        Application.status === "approved"
                          ? "bg-green-200 text-green-800"
                          : Application.status === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {Application.status.toUpperCase()}
                    </span>
                  </p>
                </div>

                {Application.status === "pending" && (
                  <div className="flex gap-3 mt-4 justify-end">
                    <button 
                    onClick={() => handleGuideApprove(Application._id, Application.userId)}
                    className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition">
                      Approve
                    </button>
                    <button 
                    className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}