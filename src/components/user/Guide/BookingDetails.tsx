import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaClock,
    FaTimesCircle,
    FaCheckCircle,
    FaExclamationCircle,
    FaMoneyBillWave,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaHome,
    FaInfoCircle,
    FaHandshake
} from "react-icons/fa";
import { AppDispatch, RootState } from "../../../redux/store";
import Navbar from "../home/Navbar";
import { cancelBookingThunk, fetchUserBookingDetailsThunk } from "../../../redux/user/userThunks";
import ConfirmationDialog from "../../common/ConfirmationDialog";

interface BookingDetails {
    _id: string;
    createdAt: string;
    durationInDays: string;
    endDate: string;
    guide: {
        id: string;
        name: string;
        email: string;
        profilePic?: string;
        basedOn?: string;
        bio?: string;
    };
    guideAccepted: boolean;
    locations: string[];
    paymentStatus: string;
    rejected: boolean;
    rejectedReason?: string;
    specialRequests: string;
    startDate: string;
    status: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    totalAmount?: number;
    paymentMethod?: string;
    bookingReference?: string;
    paymentDeadline?: string;
}

export default function BookingDetailsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            if (bookingId) {
                const response = await dispatch(fetchUserBookingDetailsThunk(bookingId));
                setBooking(response as BookingDetails);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        try {
            if (bookingId) {
                const response = await dispatch(cancelBookingThunk(bookingId));
                console.log(response);
                // Refresh booking details after cancellation
                fetchBookingDetails();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setShowCancelModal(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        if (bookingId) fetchBookingDetails();
    }, [isAuthenticated, bookingId]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: string, rejected: boolean,) => {
        if (rejected) {
            return <FaTimesCircle className="text-red-500 mr-2" />;
        }

        switch (status) {
            case 'confirmed':
                return <FaCheckCircle className="text-green-500 mr-2" />;
            case 'pending':
                return <FaExclamationCircle className="text-yellow-500 mr-2" />;
            case 'completed':
                return <FaCheckCircle className="text-blue-500 mr-2" />;
            case 'accepted':
                return <FaHandshake className="text-green-100 mr-2" />;
            default:
                return <FaExclamationCircle className="text-gray-500 mr-2" />;
        }
    };

    const formatDeadline = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusText = (status: string, rejected: boolean, guideAccepted: boolean) => {
        if (rejected) return "Rejected";
        if (status === 'pending' && guideAccepted) return "Awaiting Payment";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusColor = (status: string, rejected: boolean) => {
        if (rejected) return "bg-red-100 text-red-800";

        switch (status) {
            case 'confirmed':
                return "bg-green-100 text-green-800";
            case 'pending':
                return "bg-yellow-100 text-yellow-800";
            case 'completed':
                return "bg-blue-100 text-blue-800";
            case "accepted":
                return "bg-green-800 text-green-100"
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleContactGuide = () => {
        if (booking?.guide.email) {
            window.location.href = `mailto:${booking.guide.email}`;
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="pt-24 pb-10 px-4 max-w-6xl mx-auto min-h-screen">
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-[#9B8759] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </section>
            </>
        );
    }

    if (!booking) {
        return (
            <>
                <Navbar />
                <section className="pt-24 pb-10 px-4 max-w-6xl mx-auto min-h-screen">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[#9B8759] mb-6 hover:underline"
                    >
                        <FaArrowLeft className="mr-2" /> Back to bookings
                    </button>
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-[#2c3e50] mb-2">Booking not found</h2>
                        <p className="text-gray-600 mb-6">The requested booking could not be found.</p>
                        <button
                            onClick={() => navigate('/booking')}
                            className="bg-[#9B8759] hover:bg-[#8a7950] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                        >
                            Back to My Bookings
                        </button>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="pt-24 pb-10 px-4 max-w-6xl mx-auto min-h-screen">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#9B8759] mb-6 hover:underline"
                >
                    <FaArrowLeft className="mr-2" /> Back to bookings
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-[#2c3e50]">
                                    Booking Details
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Reference: {booking.bookingReference || booking._id}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status, booking.rejected)}`}>
                                    {getStatusIcon(booking.status, booking.rejected)}
                                    {getStatusText(booking.status, booking.rejected, booking.guideAccepted)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Booking Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trip Details Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#f8f5ef]">
                                <h2 className="text-lg font-semibold text-[#2c3e50] flex items-center">
                                    <FaMapMarkerAlt className="text-[#9B8759] mr-2" />
                                    Trip Details
                                </h2>
                            </div>
                            <div className="p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Start Date</p>
                                        <p className="font-medium flex items-center">
                                            <FaCalendarAlt className="text-[#9B8759] mr-2" />
                                            {formatDate(booking.startDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">End Date</p>
                                        <p className="font-medium flex items-center">
                                            <FaCalendarAlt className="text-[#9B8759] mr-2" />
                                            {formatDate(booking.endDate)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium flex items-center">
                                            <FaClock className="text-[#9B8759] mr-2" />
                                            {booking.durationInDays} days
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Booking Date</p>
                                        <p className="font-medium">
                                            {formatDateTime(booking.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-sm text-gray-500">Destinations</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {booking.locations.map((location, index) => (
                                            <span key={index} className="bg-[#f8f5ef] text-[#9B8759] px-3 py-1 rounded-full text-sm flex items-center">
                                                <FaMapMarkerAlt className="mr-1" /> {location}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {booking.specialRequests && (
                                    <div className="mt-6">
                                        <p className="text-sm text-gray-500">Special Requests</p>
                                        <div className="bg-[#f8f5ef] p-4 rounded-lg mt-2">
                                            <p className="text-[#2c3e50]">{booking.specialRequests}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guide Information Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#f8f5ef]">
                                <h2 className="text-lg font-semibold text-[#2c3e50] flex items-center">
                                    <FaUser className="text-[#9B8759] mr-2" />
                                    Guide Information
                                </h2>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center">
                                    {booking.guide.profilePic ? (
                                        <img
                                            src={booking.guide.profilePic}
                                            alt={booking.guide.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-[#9B8759] flex items-center justify-center text-white text-xl font-bold">
                                            {booking.guide.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-[#2c3e50]">{booking.guide.name}</h3>
                                        <p className="text-gray-600 text-sm flex items-center">
                                            <FaEnvelope className="mr-1" /> {booking.guide.email}
                                        </p>
                                        {booking.guide.basedOn && (
                                            <p className="text-gray-600 text-sm mt-1">
                                                Based in: {booking.guide.basedOn}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {booking.guide.bio && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">About the Guide</p>
                                        <p className="mt-1 text-[#2c3e50]">{booking.guide.bio}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleContactGuide}
                                    className="mt-4 bg-[#9B8759] hover:bg-[#8a7950] text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
                                >
                                    <FaEnvelope className="mr-2" /> Contact Guide
                                </button>
                            </div>
                        </div>

                        {/* Rejection Reason (if applicable) */}
                        {booking.rejected && booking.rejectedReason && (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-red-50">
                                    <h2 className="text-lg font-semibold text-red-800 flex items-center">
                                        <FaInfoCircle className="text-red-600 mr-2" />
                                        Rejection Reason
                                    </h2>
                                </div>
                                <div className="p-5">
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-red-700">{booking.rejectedReason}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Payment & User Info */}
                    <div className="space-y-6">
                        {/* Payment Information Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#f8f5ef]">
                                <h2 className="text-lg font-semibold text-[#2c3e50] flex items-center">
                                    <FaMoneyBillWave className="text-[#9B8759] mr-2" />
                                    Payment Information
                                </h2>
                            </div>
                            <div className="p-5">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Payment Status</p>
                                    <p className={`font-medium capitalize ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-[#9B8759]'}`}>
                                        {booking.paymentStatus}
                                    </p>
                                </div>

                                {booking.paymentDeadline && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500">Payment Deadline</p>
                                        <p className="font-medium text-red-600">
                                            {formatDeadline(booking.paymentDeadline)}
                                        </p>
                                    </div>
                                )}

                                {booking.totalAmount && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="font-medium text-xl text-[#2c3e50]">
                                            ${booking.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                )}

                                {booking.paymentMethod && (
                                    <div>
                                        <p className="text-sm text-gray-500">Payment Method</p>
                                        <p className="font-medium capitalize">{booking.paymentMethod}</p>
                                    </div>
                                )}

                                {booking.paymentStatus === 'pending' && (
                                    <button className="mt-4 w-full bg-[#9B8759] hover:bg-[#8a7950] text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                                        Complete Payment
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Your Information Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#f8f5ef]">
                                <h2 className="text-lg font-semibold text-[#2c3e50] flex items-center">
                                    <FaUser className="text-[#9B8759] mr-2" />
                                    Your Information
                                </h2>
                            </div>
                            <div className="p-5">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium flex items-center">
                                        <FaUser className="text-[#9B8759] mr-2" />
                                        {booking.user.name}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium flex items-center">
                                        <FaEnvelope className="text-[#9B8759] mr-2" />
                                        {booking.user.email}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium flex items-center">
                                        <FaPhone className="text-[#9B8759] mr-2" />
                                        {booking.user.phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium flex items-center">
                                        <FaHome className="text-[#9B8759] mr-2" />
                                        {booking.user.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-[#f8f5ef]">
                                <h2 className="text-lg font-semibold text-[#2c3e50]">Actions</h2>
                            </div>
                            <div className="p-5 space-y-3">
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300">
                                    Download Invoice
                                </button>
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300">
                                    Request Changes
                                </button>
                                {booking.status !== 'cancelled' && (
                                    <button 
                                        onClick={() => setShowCancelModal(true)}
                                        className="w-full bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-lg transition duration-300"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationDialog
                    isOpen={showCancelModal}
                    title="Cancel Booking"
                    message="Are you sure you want to cancel this booking? This action cannot be undone."
                    color="#dc2626" // red-600
                    onConfirm={handleCancelBooking}
                    onCancel={() => setShowCancelModal(false)}
                />
            </section>
        </>
    );
}