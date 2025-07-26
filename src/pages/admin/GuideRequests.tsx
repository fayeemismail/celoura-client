// pages/admin/GuideRequests.tsx
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import {
  ApproveAsGuide,
  GetAllGuideApplications,
  RejectAsGuide,
} from "../../redux/admin/authThunks";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

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
  basedOn: string;
  userId: string;
}

export default function GuideRequests() {
  const [guideApplies, setGuideApplies] = useState<requests[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<requests | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveApplication, setApproveApplication] = useState<requests | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const dispatch = useDispatch<AppDispatch>();

  const getGuideApplies = async (page: number) => {
    try {
      const response = await dispatch(GetAllGuideApplications(page, limit));
      setGuideApplies(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (error) {
      console.error("Error fetching guide applications", error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      getGuideApplies(page);
    }
  };

  const confirmReject = (application: requests) => {
    setSelectedApplication(application);
    setConfirmDialogOpen(true);
  };

  const confirmApprove = (application: requests) => {
    setApproveApplication(application);
    setApproveDialogOpen(true);
  };

  const handleRejectConfirmed = async () => {
    if (!selectedApplication) return;
    setShowReasonModal(true);
    setConfirmDialogOpen(false);
  };

  const submitRejectionWithReason = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await dispatch(RejectAsGuide({
        applicationId: selectedApplication._id, 
        userId: selectedApplication.userId,
        reason: rejectionReason
      }));
      setGuideApplies((prev) =>
        prev?.map((app) =>
          app._id === selectedApplication._id ? { ...app, status: "rejected" } : app
        )
      );
      toast.success("Rejected Guide Application successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error on Rejecting the guide");
    } finally {
      setShowReasonModal(false);
      setSelectedApplication(null);
      setRejectionReason("");
    }
  };

  const handleApproveConfirmed = async () => {
    if (!approveApplication) return;
    try {
      await dispatch(ApproveAsGuide(approveApplication._id, approveApplication.userId));
      setGuideApplies((prev) =>
        prev?.map((app) =>
          app._id === approveApplication._id ? { ...app, status: "approved" } : app
        )
      );
      toast.success("Approved as guide successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error approving the guide");
    } finally {
      setApproveDialogOpen(false);
      setApproveApplication(null);
    }
  };

  useEffect(() => {
    getGuideApplies(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1F2C] flex">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guideApplies?.map((Application) => (
              <div
                key={Application._id}
                className="bg-[#1D2436] border border-[#2D3345] rounded-xl shadow-sm p-6 hover:shadow-md transition flex flex-col"
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-[#2D3345]">
                    <img
                      src={Application.idFileUrl}
                      alt={`${Application.fullName}'s ID`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/300x200?text=ID+Not+Available";
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-200 flex-grow">
                  <p><span className="font-medium text-white">Name:</span> {Application.fullName}</p>
                  <p><span className="font-medium text-white">Email:</span> {Application.email}</p>
                  <p><span className="font-medium text-white">Phone:</span> {Application.phone}</p>
                  <p><span className="font-medium text-white">Experience:</span> {Application.experience}</p>
                  <p><span className="font-medium text-white">Expertise:</span> {Application.expertise}</p>
                  <p><span className="font-medium text-white">Address:</span> {Application.address}</p>
                  <p><span className="font-medium text-white">Based On:</span> {Application.basedOn}</p>
                  
                  <p>
                    <span className="font-medium text-white">Status:</span>{" "}
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                      Application.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : Application.status === "rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}>
                      {Application.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="flex gap-3 mt-4 justify-end">
                  {Application.status === "pending" && (
                    <>
                      <button
                        onClick={() => confirmApprove(Application)}
                        className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => confirmReject(Application)}
                        className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {Application.status === "approved" && (
                    <button
                      onClick={() => confirmReject(Application)}
                      className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-2 text-white">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1 ? "bg-blue-600" : "bg-gray-700"
                } hover:bg-gray-600`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Reject Confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        message="Are you sure you want to reject this application?"
        color="#dc2626"
        onConfirm={handleRejectConfirmed}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {/* Rejection Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1D2436] border border-[#2D3345] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-2 text-white">Rejection Reason</h3>
            <p className="mb-4 text-gray-300">Please provide the reason for rejection:</p>
            <textarea
              className="w-full mt-3 p-2 border border-[#2D3345] rounded-md text-white bg-[#1A1F2C]"
              rows={3}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitRejectionWithReason}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation */}
      <ConfirmationDialog
        isOpen={approveDialogOpen}
        message="Are you sure you want to approve this application?"
        color="#16a34a"
        onConfirm={handleApproveConfirmed}
        onCancel={() => setApproveDialogOpen(false)}
      />
    </div>
  );
}