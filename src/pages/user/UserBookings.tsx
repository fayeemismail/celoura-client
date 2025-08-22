import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserBookingsThunk } from "../../redux/user/userThunks";
import Navbar from "../../components/user/home/Navbar";
import { FaCalendarAlt, FaMapMarkerAlt, FaTimesCircle, FaCheckCircle, FaExclamationCircle, FaMoneyBillWave, FaHandshake } from "react-icons/fa";

interface Booking {
    _id: string;
    createdAt: string;
    durationInDays: string;
    endDate: string;
    guide: {
        id: string;
        name: string;
        email: string;
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
}

export default function BookingsUser() {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await dispatch(fetchUserBookingsThunk(currentUser?.id!));
            if (Array.isArray(response)) {
                setBookings(response);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        fetchBookings();
    }, [isAuthenticated]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusIcon = (status: string, rejected: boolean) => {
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
                return <FaExclamationCircle className="text-emerald-500 mr-2" />;
        }
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

    return (
        <>
            <Navbar />
            <section className="pt-24 pb-10 px-4 max-w-6xl mx-auto min-h-screen">
                <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">My Bookings</h1>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-[#9B8759] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FaCalendarAlt className="text-5xl text-[#9B8759] mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-[#2c3e50] mb-2">No bookings yet</h2>
                        <p className="text-gray-600 mb-6">You haven't made any bookings with our guides.</p>
                        <button
                            onClick={() => navigate('/destinations')}
                            className="bg-[#9B8759] hover:bg-[#8a7950] text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                        >
                            Explore Destinations
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-[#2c3e50]">
                                                Tour with {booking.guide.name}
                                            </h2>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Booked on {formatDate(booking.createdAt)}
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

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <FaCalendarAlt className="text-[#9B8759] mt-1 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Dates</p>
                                                <p className="font-medium">
                                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                                </p>
                                                <p className="text-sm text-gray-500">{booking.durationInDays} days</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="text-[#9B8759] mt-1 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Destinations</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {booking.locations.map((location, index) => (
                                                        <span key={index} className="bg-[#f8f5ef] text-[#9B8759] px-3 py-1 rounded-full text-sm">
                                                            {location}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <FaMoneyBillWave className="text-[#9B8759] mt-1 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Payment Status</p>
                                                <p className="font-medium capitalize">{booking.paymentStatus}</p>
                                            </div>
                                        </div>

                                        {booking.specialRequests && (
                                            <div>
                                                <p className="text-sm text-gray-500">Special Requests</p>
                                                <p className="font-medium">{booking.specialRequests}</p>
                                            </div>
                                        )}

                                        {booking.rejected && booking.rejectedReason && (
                                            <div className="bg-red-50 p-4 rounded-lg">
                                                <p className="text-sm font-medium text-red-800">Reason for rejection:</p>
                                                <p className="text-red-700">{booking.rejectedReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/booking/${booking._id}`)}
                                        className="text-[#9B8759] hover:text-[#8a7950] font-medium py-2 px-4 rounded transition duration-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}