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
import GuideApplicationDetails from "../../components/admin/GuideApplicationDetails";

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
  profilePhotoUrl?: string;
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
  const [selectedApplicationDetails, setSelectedApplicationDetails] = useState<Request | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

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
      setSelectedApplicationDetails(null);
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
      setSelectedApplicationDetails(null);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2b] to-[#1a1f40] flex">
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a8dfc] to-[#6dcff6] mb-2">
              Guide Applications
            </h1>
            <p className="text-[#a1a8d3]">Review and manage guide applications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideApplies?.map((application) => (
              <div 
                key={application._id}
                className={`bg-gradient-to-br from-[#0f172acc] to-[#1e293bcc] backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-[#334155] hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 `}
                onClick={() => setSelectedApplicationDetails(application)}
              >
                {/* Profile and ID Section */}
                <div className="relative">
                  {/* Profile photo if available */}
                  {application.profilePhotoUrl && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                        <img
                          src={application.profilePhotoUrl}
                          alt={`${application.fullName}'s Profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* ID Document */}
                  <div className="h-48 bg-gradient-to-r from-[#1e293b] to-[#334155] overflow-hidden relative">
                    <img
                      src={application.idFileUrl}
                      alt={`${application.fullName}'s ID`}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/300x200?text=ID+Not+Available";
                      }}
                    />
                    
                    {/* Status badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      application.status === "approved"
                        ? "bg-[#10b981] text-white"
                        : application.status === "rejected"
                        ? "bg-[#ef4444] text-white"
                        : "bg-[#f59e0b] text-white"
                    }`}>
                      {application.status.toUpperCase()}
                    </div>
                    
                    {/* Re-apply badge */}
                    {application.re_apply && application.re_apply > 0 && (
                      <div className="absolute bottom-4 left-4 bg-[#fef3c7] text-[#92400e] text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        Re-applied {application.re_apply > 1 ? `(${application.re_apply})` : ''}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#e2e8f0] mb-3 flex items-center">
                      {application.fullName}
                      <span className="ml-2 text-[#8a8dfc]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </h3>
                    
                    <div className="space-y-2 text-sm text-[#cbd5e1] mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#8a8dfc]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>{application.email}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#8a8dfc]" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>{application.phone}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#8a8dfc]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{application.expertise}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#8a8dfc]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Applied: {formatDate(application.createdAt)}</span>
                      </div>
                    </div>

                    {/* Rejection reason if applicable */}
                    {application.status === 'rejected' && application.rejectReason && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-[#fee2e280] to-[#fecaca80] rounded-lg border border-[#fecaca]">
                        <p className="text-xs font-medium text-[#b91c1c] flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Rejection Reason:
                        </p>
                        <p className="text-xs text-[#dc2626] mt-1">{application.rejectReason}</p>
                      </div>
                    )}

                    {/* Previous rejection for re-applications */}
                    {application.re_apply !== undefined && application.re_apply > 0 && application.status === 'pending' && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-[#fffbeb80] to-[#fde68a80] rounded-lg border border-[#fde68a]">
                        <p className="text-xs font-medium text-[#92400e] flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                          Previous Rejection Reason:
                        </p>
                        <p className="text-xs text-[#92400e] mt-1">
                          {application.rejectReason || "No reason provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-[#334155]">
                    <div className="flex justify-end gap-2">
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmApprove(application);
                            }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#34d399] text-white text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmReject(application);
                            }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Reject
                          </button>
                        </>
                      )}
                      {application.status === "approved" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmReject(application);
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Revoke
                        </button>
                      )}
                      {application.status === "rejected" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmApprove(application);
                          }}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#34d399] text-white text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gradient-to-r from-[#1e293b] to-[#334155] text-[#cbd5e1] hover:from-[#334155] hover:to-[#475569] disabled:opacity-50 transition-all duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      currentPage === index + 1 
                        ? 'bg-gradient-to-r from-[#8a8dfc] to-[#6dcff6] text-white shadow-lg' 
                        : 'bg-gradient-to-r from-[#1e293b] to-[#334155] text-[#cbd5e1] hover:from-[#334155] hover:to-[#475569]'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gradient-to-r from-[#1e293b] to-[#334155] text-[#cbd5e1] hover:from-[#334155] hover:to-[#475569] disabled:opacity-50 transition-all duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs with higher z-index */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        message="Are you sure you want to reject this application?"
        color="#dc2626"
        onConfirm={handleRejectConfirmed}
        onCancel={() => setConfirmDialogOpen(false)}
        zIndex={60}
      />

      {showReasonModal && (
        <div className="fixed inset-0 bg-[#00000080] backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-[#475569] rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#8a8dfc] to-[#6dcff6] mb-3">Rejection Reason</h3>
            <p className="mb-4 text-[#cbd5e1]">Please provide a clear reason for rejection:</p>
            <textarea
              className="w-full p-3 bg-[#1e293b] border border-[#475569] rounded-lg text-[#e2e8f0] focus:ring-2 focus:ring-[#8a8dfc] focus:border-transparent"
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
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#475569] to-[#64748b] text-white hover:shadow-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={submitRejectionWithReason}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white hover:shadow-lg transition-all duration-300"
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
        zIndex={80}
      />

      <GuideApplicationDetails
        application={selectedApplicationDetails}
        isOpen={!!selectedApplicationDetails}
        onClose={() => setSelectedApplicationDetails(null)}
        onApprove={confirmApprove}
        onReject={confirmReject}
        zIndex={50}
      />
    </div>
  );
}