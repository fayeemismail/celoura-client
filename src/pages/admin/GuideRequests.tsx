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

interface Request {
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
  rejectReason?: string;
  re_apply?: number;
  createdAt: string;
}

export default function GuideRequests() {
  const [guideApplies, setGuideApplies] = useState<Request[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Request | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveApplication, setApproveApplication] = useState<Request | null>(null);
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
      toast.error("Failed to load applications");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      getGuideApplies(page);
    }
  };

  const confirmReject = (application: Request) => {
    setSelectedApplication(application);
    setConfirmDialogOpen(true);
  };

  const confirmApprove = (application: Request) => {
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
          app._id === selectedApplication._id ? { 
            ...app, 
            status: "rejected",
            rejectReason: rejectionReason,
            re_apply: (app.re_apply || 0) + 1
          } : app
        )
      );
      toast.success("Application rejected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error rejecting the application");
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
      toast.success("Guide approved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error approving the guide");
    } finally {
      setApproveDialogOpen(false);
      setApproveApplication(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    getGuideApplies(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#061223] flex">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-[#d9dfea] mb-6">Guide Applications</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideApplies?.map((application) => (
              <div 
                key={application._id}
                className="bg-[#0e0b406b] rounded-xl shadow-sm overflow-hidden border border-[#0d0948] hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="relative h-48 bg-[#f3f4f6] overflow-hidden">
                  <img
                    src={application.idFileUrl}
                    alt={`${application.fullName}'s ID`}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/300x200?text=ID+Not+Available";
                    }}
                  />
                  {application.re_apply && application.re_apply > 0 && (
                    <div className="absolute top-2 right-2 bg-[#fef3c7] text-[#92400e] text-xs font-bold px-2 py-1 rounded-full">
                      Re-applied {application.re_apply > 1 ? `(${application.re_apply})` : ''}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-[#dfe2e9]">{application.fullName}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        application.status === "approved"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : application.status === "rejected"
                          ? "bg-[#fee2e2] text-[#991b1b]"
                          : "bg-[#dbeafe] text-[#18338d]"
                      }`}>
                        {application.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-[#dee4ec] mb-4">
                      <p><span className="font-medium text-[#dee4ec]">Email:</span> {application.email}</p>
                      <p><span className="font-medium text-[#dee4ec]">Phone:</span> {application.phone}</p>
                      <p><span className="font-medium text-[#dee4ec]">Expertise:</span> {application.expertise}</p>
                      <p><span className="font-medium text-[#dee4ec]">Applied:</span> {formatDate(application.createdAt)}</p>
                    </div>

                    {application.status === 'rejected' && application.rejectReason && (
                      <div className="mt-3 p-3 bg-[#fef2f2] rounded-lg border border-[#fecaca]">
                        <p className="text-xs font-medium text-[#b91c1c]">Rejection Reason:</p>
                        <p className="text-xs text-[#dc2626] mt-1">{application.rejectReason}</p>
                      </div>
                    )}

                    {application.re_apply !== undefined && application.re_apply > 0 && application.status === 'pending' && (
                      <div className="mt-3 p-3 bg-[#fffbeb] rounded-lg border border-[#fde68a]">
                        <p className="text-xs font-medium text-[#92400e]">Previous Rejection Reason:</p>
                        <p className="text-xs text-[#92400e] mt-1">
                          {application.rejectReason || "No reason provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1e1e4e]">
                    <div className="flex justify-end gap-2">
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={() => confirmApprove(application)}
                            className="px-3 py-1.5 rounded-md bg-[#16a34a] text-white text-sm font-medium hover:bg-[#15803d] transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => confirmReject(application)}
                            className="px-3 py-1.5 rounded-md bg-[#dc2626] text-white text-sm font-medium hover:bg-[#b91c1c] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {application.status === "approved" && (
                        <button
                          onClick={() => confirmReject(application)}
                          className="px-3 py-1.5 rounded-md bg-[#dc2626] text-white text-sm font-medium hover:bg-[#b91c1c] transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      {application.status === "rejected" && (
                        <button
                          onClick={() => confirmApprove(application)}
                          className="px-3 py-1.5 rounded-md bg-[#16a34a] text-white text-sm font-medium hover:bg-[#15803d] transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md bg-[#e5e7eb] text-[#4b5563] hover:bg-[#d1d5db] disabled:opacity-50 transition-colors"
                >
                  &larr;
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      currentPage === index + 1 ? 'bg-[#3b82f6] text-white' : 'bg-[#e5e7eb] text-[#4b5563] hover:bg-[#d1d5db]'
                    } transition-colors`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md bg-[#e5e7eb] text-[#4b5563] hover:bg-[#d1d5db] disabled:opacity-50 transition-colors"
                >
                  &rarr;
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        message="Are you sure you want to reject this application?"
        color="#dc2626"
        onConfirm={handleRejectConfirmed}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {showReasonModal && (
        <div className="fixed inset-0 bg-[#00000080] backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#ffffff] rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-[#e5e7eb]">
            <h3 className="text-xl font-semibold text-[#111827] mb-3">Rejection Reason</h3>
            <p className="mb-4 text-[#4b5563]">Please provide a clear reason for rejection:</p>
            <textarea
              className="w-full p-3 border border-[#e5e7eb] rounded-lg text-[#111827] bg-[#f9fafb] focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              rows={4}
              placeholder="Example: Your experience doesn't meet our requirements..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 rounded-md bg-[#e5e7eb] text-[#374151] hover:bg-[#d1d5db] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRejectionWithReason}
                className="px-4 py-2 rounded-md bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

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