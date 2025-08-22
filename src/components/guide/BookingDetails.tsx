import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { acceptBookingThunk, fetchBookingDetailsThunk, rejectBookingThunk } from "../../redux/guide/authThunks";
import { AppDispatch, RootState } from "../../redux/store";
import Sidebar from "./GuideSidebar";
import GuideNavbar from "./GuideNavbar";
import BudgetModal from "../common/BudgetModal";
import RejectModal from "../common/RejectModal";
import { toast } from "react-toastify";

type Booking = {
  _id: string;
  durationInDays: string;
  startDate: string;
  endDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  guideAccepted: boolean;
  rejected: boolean;
  rejectedReason: string;
  locations: string[];
  specialRequests: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  paymentStatus: string;
};

const BookingDetails = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.guide);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // modal states
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!isAuthenticated) navigate("/guide/login");
    if (id) {
      fetchBookingDetails();
    }
  }, [isAuthenticated, id]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const result = await dispatch(fetchBookingDetailsThunk(id!));
      if (result && result.data) {
        setBooking(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // accept with budget
  const handleAcceptBooking = async (budget: number) => {
    if (!booking) return;
    setProcessing(true);
    try {
      await dispatch(acceptBookingThunk(booking._id!, budget));
      setShowBudgetModal(false);
      toast.success('Booking Accepted');
      navigate('/guide/booking')
    } catch (error) {
        toast.error("Cannot Accept Booking");
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  // reject with reason
  const handleRejectBooking = async (reason: string) => {
    if (!booking) return;
    setProcessing(true);
    try {
      await dispatch(rejectBookingThunk(booking._id, reason));
      toast.success("Booking Rejected Successfully")
      setShowRejectModal(false);
    } catch (error) {
        toast.error("Something went wrong Cannot Reject the Booking")
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#0a0a0a] text-white justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex bg-[#0a0a0a] text-white">
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <GuideNavbar />
          <div className="flex-1 flex flex-col items-center justify-center px-8 pb-10">
            <div className="text-center animate-fade-in-up max-w-md">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Booking Not Found
              </h2>
              <p className="text-gray-400 mb-8">
                The booking you're looking for doesn't exist or may have been
                removed.
              </p>
              <button
                onClick={() => navigate("/guide/booking")}
                className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all shadow-md"
              >
                Return to Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <GuideNavbar />
        <main className="pt-24 px-8 pb-10 max-w-6xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/guide/booking")}
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Bookings
            </button>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Booking Details
            </h1>
          </div>

          {/* Booking Card */}
          <div className="bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-gray-800 rounded-2xl overflow-hidden shadow-lg p-6 backdrop-blur-md mb-8">
            {/* Header with Status */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">
                  {booking.user.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )} shadow-sm`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
                {!booking.guideAccepted &&
                  !booking.rejected &&
                  booking.status === "pending" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-md">
                      Action Required
                    </span>
                  )}
              </div>
              <div className="text-sm text-gray-400">
                Created: {formatDate(booking.createdAt)}
              </div>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                <p className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                  Duration
                </p>
                <p className="text-lg font-semibold">
                  {booking.durationInDays} days
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                <p className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                  Dates
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(booking.startDate)} →{" "}
                  {formatDate(booking.endDate)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                <p className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                  Payment Status
                </p>
                <p className="text-lg font-semibold capitalize">
                  {booking.paymentStatus}
                </p>
              </div>
            </div>

            {/* User Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-indigo-300">
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                  <p className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                    Email
                  </p>
                  <p className="text-lg font-semibold">{booking.user.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                  <p className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                    Phone
                  </p>
                  <p className="text-lg font-semibold">{booking.user.phone}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700 md:col-span-2">
                  <p className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                    Address
                  </p>
                  <p className="text-lg font-semibold">{booking.user.address}</p>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-indigo-300">
                Tour Locations
              </h3>
              <div className="flex flex-wrap gap-3">
                {booking.locations.map((location, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-md border border-indigo-600/40"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-indigo-300">
                  Special Requests
                </h3>
                <div className="p-4 rounded-xl bg-[#1a1f2e]/60 border border-gray-700">
                  <p className="text-base">{booking.specialRequests}</p>
                </div>
              </div>
            )}

            {/* Rejection Reason if rejected */}
            {booking.rejected && booking.rejectedReason && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-red-300">
                  Rejection Reason
                </h3>
                <div className="p-4 rounded-xl bg-red-900/40 border border-red-700">
                  <p className="text-base">{booking.rejectedReason}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {booking.status === "pending" &&
              !booking.guideAccepted &&
              !booking.rejected && (
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => setShowBudgetModal(true)}
                    className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all shadow-md"
                  >
                    Accept Booking
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition-all shadow-md"
                  >
                    Reject Booking
                  </button>
                </div>
              )}
          </div>
        </main>

        {/* Modals */}
        <BudgetModal
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          onConfirm={handleAcceptBooking}
          processing={processing}
        />
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectBooking}
          processing={processing}
        />
      </div>
    </div>
  );
};

export default BookingDetails;
