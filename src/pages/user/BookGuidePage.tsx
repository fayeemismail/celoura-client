import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { AppDispatch, RootState } from "../../redux/store";
import Navbar from "../../components/user/home/Navbar";
import { bookGuideThunk, getGuideDataOnBookingThunk } from "../../redux/user/userThunks";

type Guide = {
    _id: string;
    name: string;
    email: string;
    basedOn: string;
    bio: string;
    profilePic: string;
    availableDestinations: string[];
    followers: string[];
    happyCustomers: string[];
};

export default function BookGuidePage() {
    const { guideId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        startDate: "",
        endDate: "",
        days: 1,
        budget: 1000,
        specialRequests: "",
        selectedDestinations: [] as string[],
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        startDate: "",
        endDate: "",
        budget: "",
    });

    const { isAuthenticated, error, currentUser } = useSelector(
        (state: RootState) => state.user
    );

    const getGuideDetails = async () => {
        setLoading(true);
        try {
            if (guideId) {
                const data = await dispatch(getGuideDataOnBookingThunk(guideId));
                setGuide(data);

                if (location.state?.destinationName) {
                    setFormData(prev => ({
                        ...prev,
                        selectedDestinations: [location.state.destinationName]
                    }));
                }
            }
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) navigate("/login");
        getGuideDetails();
    }, [isAuthenticated, guideId]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone: string) => {
        return phone.length === 10 && /^\d+$/.test(phone);
    };

    const validateAddress = (address: string) => {
        return address.length >= 10;
    };

    const validateBudget = (budget: number) => {
        return budget >= 1000;
    };

    const validateName = (name: string) => {
        return name.length >= 3;
    };

    const validateDates = () => {
        if (!formData.startDate) {
            setErrors(prev => ({ ...prev, startDate: "Start date is required" }));
            return false;
        }
        if (!formData.endDate) {
            setErrors(prev => ({ ...prev, endDate: "End date is required" }));
            return false;
        }
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end < start) {
            setErrors(prev => ({ ...prev, endDate: "End date must be after start date" }));
            return false;
        }
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        if (name === "email") {
            setErrors(prev => ({
                ...prev,
                email: validateEmail(value) ? "" : "Please enter a valid email address"
            }));
        } else if (name === "phone") {
            setErrors(prev => ({
                ...prev,
                phone: validatePhone(value) ? "" : "Phone number must be at least 10 digits and contain only numbers"
            }));
        } else if (name === "address") {
            setErrors(prev => ({
                ...prev,
                address: validateAddress(value) ? "" : "Address must be at least 10 characters"
            }));
        } else if (name === "name") {
            setErrors(prev => ({
                ...prev,
                name: validateName(value) ? "" : "Name must be at least 3 characters"
            }));
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseInt(value) || 0;

        if (name === "budget") {
            if (numValue < 1000) {
                setErrors(prev => ({
                    ...prev,
                    budget: "Minimum budget is $1000"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    budget: ""
                }));
            }
            setFormData(prev => ({
                ...prev,
                [name]: numValue
            }));
            return;
        }

        if (name === "days" && numValue < 1) return;

        setFormData(prev => ({
            ...prev,
            [name]: numValue
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));


        setErrors(prev => ({
            ...prev,
            startDate: "",
            endDate: ""
        }));


        if ((name === "startDate" && formData.endDate) || (name === "endDate" && formData.startDate)) {
            const start = new Date(name === "startDate" ? value : formData.startDate);
            const end = new Date(name === "endDate" ? value : formData.endDate);


            if (end > start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setFormData(prev => ({
                    ...prev,
                    days: diffDays
                }));
            } else {

                setFormData(prev => ({
                    ...prev,
                    days: 1
                }));
            }
        }
    };

    const handleDestinationSelect = (destinationName: string) => {
        setFormData(prev => {
            const isSelected = prev.selectedDestinations.includes(destinationName);
            let newSelected = [...prev.selectedDestinations];

            if (isSelected) {
                newSelected = newSelected.filter(name => name !== destinationName);
            } else {
                newSelected.push(destinationName);
            }

            return {
                ...prev,
                selectedDestinations: newSelected
            };
        });
    };

    const validateForm = () => {
        const nameValid = validateName(formData.name);
        const emailValid = validateEmail(formData.email);
        const phoneValid = validatePhone(formData.phone);
        const addressValid = validateAddress(formData.address);
        const budgetValid = validateBudget(formData.budget);
        const datesValid = validateDates();

        setErrors({
            name: nameValid ? "" : "Name must be at least 3 characters",
            email: emailValid ? "" : "Please enter a valid email address",
            phone: phoneValid ? "" : "Phone number must be at least 10 digits and contain only numbers",
            address: addressValid ? "" : "Address must be at least 10 characters",
            budget: budgetValid ? "" : "Minimum budget is $1000",
            startDate: formData.startDate ? "" : "Start date is required",
            endDate: formData.endDate ? "" : "End date is required",
        });

        return nameValid && emailValid && phoneValid && addressValid && budgetValid && datesValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("address", formData.address);
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("days", formData.days.toString());
        data.append("budget", formData.budget.toString());
        data.append("specialRequests", formData.specialRequests);
        data.append("selectedDestinations", JSON.stringify(formData.selectedDestinations));

        try {
            console.log(data, 'this is data sending to backend')
            const response = await dispatch(bookGuideThunk(data, guide?._id!, currentUser?.id!));
            console.log(response)
        } catch (error) {
            console.error("Booking failed", error);
        }
    };


    return (
        <>
            <Navbar />
            <section className="pt-24 pb-10 px-4 max-w-7xl mx-auto min-h-screen">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#9B8759] mb-6 hover:underline"
                >
                    <FaArrowLeft className="mr-2" /> Back to destination
                </button>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-[#9B8759] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : guide ? (
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        {/* Guide Info Section */}
                        <div className="p-8 border-b border-gray-100">
                            <h1 className="text-3xl font-bold mb-6 text-gray-900">
                                Book Guide: {guide.name}
                            </h1>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    {guide.profilePic ? (
                                        <img
                                            src={guide.profilePic}
                                            alt={guide.name}
                                            className="w-32 h-32 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-32 h-32 text-gray-400" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold mb-2">{guide.name}</h2>
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-medium">Email:</span> {guide.email}
                                    </p>
                                    <p className="text-gray-600 mb-3">
                                        <span className="font-medium">Based in:</span> {guide.basedOn}
                                    </p>

                                    <p className="text-gray-700 mb-4">{guide.bio}</p>

                                    <div className="mb-4">
                                        <h3 className="font-medium mb-1">Followers:</h3>
                                        <p>{guide.followers?.length || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available Destinations Selection */}
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-xl font-semibold mb-4">Select Destinations</h2>
                            <p className="text-gray-600 mb-4">
                                Choose the destinations you want to visit with this guide (you can select multiple)
                            </p>

                            {guide.availableDestinations?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {guide.availableDestinations.map((destination) => (
                                        <div
                                            key={destination}
                                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.selectedDestinations.includes(destination)
                                                ? "border-[#9B8759] bg-[#9B8759]/10"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => handleDestinationSelect(destination)}
                                        >
                                            <h3 className="font-medium">{destination}</h3>
                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.selectedDestinations.includes(destination)}
                                                    onChange={() => { }}
                                                    className="mr-2 h-4 w-4 text-[#9B8759] focus:ring-[#9B8759] border-gray-300 rounded"
                                                />
                                                <span className="text-sm">Select</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    <div
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${formData.selectedDestinations.includes(guide.basedOn)
                                            ? "border-[#9B8759] bg-[#9B8759]/10"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => handleDestinationSelect(guide.basedOn)}
                                    >
                                        <h3 className="font-medium">{guide.basedOn}</h3>
                                        <div className="flex items-center mt-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedDestinations.includes(guide.basedOn)}
                                                onChange={() => { }}
                                                className="mr-2 h-4 w-4 text-[#9B8759] focus:ring-[#9B8759] border-gray-300 rounded"
                                            />
                                            <span className="text-sm">Select</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Guide's base location</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Booking Form */}
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6">Booking Information</h2>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold mb-3">Personal Details</h3>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="name">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                            }`}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="email">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                            }`}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="phone">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                            }`}
                                        required
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="address">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                            }`}
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="startDate">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleDateChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.startDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                            }`}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="endDate">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleDateChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.endDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                            }`}
                                        required
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="days">
                                        Number of Days
                                    </label>
                                    <input
                                        type="number"
                                        id="days"
                                        name="days"
                                        value={formData.days}
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Calculated automatically based on your trip dates
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2" htmlFor="budget">
                                        Budget (USD) *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            id="budget"
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleNumberChange}
                                            className={`w-full pl-8 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.budget ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
                                                }`}
                                            min="1000"
                                            required
                                        />
                                    </div>
                                    {errors.budget ? (
                                        <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500 mt-1">Minimum budget: $1000</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 mb-2" htmlFor="specialRequests">
                                        Special Requests
                                    </label>
                                    <textarea
                                        id="specialRequests"
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B8759]"
                                        placeholder="Any special requirements or preferences..."
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-[#9B8759] text-white rounded-lg hover:bg-[#8a7a4d] transition-colors font-medium"
                                    >
                                        Submit Booking Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Guide not found.</p>
                )}
            </section>
        </>
    );
}