import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { AppDispatch, RootState } from "../../redux/store";
import Navbar from "../../components/user/home/Navbar";
import {
  bookGuideThunk,
  getGuideDataOnBookingThunk,
} from "../../redux/user/userThunks";

import GuideInfo from "../../components/user/Destination/GuideInfo";
import DestinationSelector from "../../components/user/Destination/DestinationSelector";
import BookingForm from "../../components/user/Destination/BookingForm";

import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
  validateBudget,
  validateDates,
} from "../../components/user/Destination/Validation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

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
  const { guideId, destinationId } = useParams();
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
    selectedDestinations: "",
  });

  const { isAuthenticated, error, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  // Fetch guide details
  const getGuideDetails = async () => {
    setLoading(true);
    try {
      if (guideId) {
        const data = await dispatch(getGuideDataOnBookingThunk(guideId));
        // console.log(data)
        setGuide(data);

        if (location.state?.destinationName) {
          setFormData((prev) => ({
            ...prev,
            selectedDestinations: [location.state.destinationName],
          }));
        }
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
    getGuideDetails();
  }, [isAuthenticated, guideId]);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Please enter a valid email address",
      }));
    } else if (name === "phone") {
      setErrors((prev) => ({
        ...prev,
        phone: validatePhone(value)
          ? ""
          : "Phone number must be 10 digits and contain only numbers",
      }));
    } else if (name === "address") {
      setErrors((prev) => ({
        ...prev,
        address: validateAddress(value)
          ? ""
          : "Address must be at least 10 characters",
      }));
    } else if (name === "name") {
      setErrors((prev) => ({
        ...prev,
        name: validateName(value)
          ? ""
          : "Name must be between 3 and 45 characters",
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    if (name === "budget") {
      if (!validateBudget(numValue)) {
        setErrors((prev) => ({ ...prev, budget: "Minimum budget is $1000" }));
      } else {
        setErrors((prev) => ({ ...prev, budget: "" }));
      }
      setFormData((prev) => ({ ...prev, [name]: numValue }));
      return;
    }

    if (name === "days" && numValue < 1) return;

    setFormData((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, startDate: "", endDate: "" }));

    if (
      (name === "startDate" && formData.endDate) ||
      (name === "endDate" && formData.startDate)
    ) {
      const start = new Date(
        name === "startDate" ? value : formData.startDate
      );
      const end = new Date(name === "endDate" ? value : formData.endDate);

      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setFormData((prev) => ({ ...prev, days: diffDays }));
      } else {
        setFormData((prev) => ({ ...prev, days: 1 }));
      }
    }
  };

  const handleDestinationSelect = (destinationName: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDestinations.includes(destinationName);
      let newSelected = [...prev.selectedDestinations];

      if (isSelected) {
        newSelected = newSelected.filter((name) => name !== destinationName);
      } else {
        newSelected.push(destinationName);
      }

      return { ...prev, selectedDestinations: newSelected };
    });

    setErrors((prev) => ({ ...prev, selectedDestinations: "" }));
  };

  // -------------------------------
  // Validation before submit
  // -------------------------------
  const validateForm = () => {
    const nameValid = validateName(formData.name);
    const emailValid = validateEmail(formData.email);
    const phoneValid = validatePhone(formData.phone);
    const addressValid = validateAddress(formData.address);
    const budgetValid = validateBudget(formData.budget);
    const datesCheck = validateDates(formData.startDate, formData.endDate);
    const destinationsValid = formData.selectedDestinations.length > 0;

    setErrors({
      name: nameValid ? "" : "Name must be between 3 and 45 characters",
      email: emailValid ? "" : "Please enter a valid email address",
      phone: phoneValid
        ? ""
        : "Phone number must be at least 10 digits and contain only numbers",
      address: addressValid ? "" : "Address must be at least 10 characters",
      budget: budgetValid ? "" : "Minimum budget is $1000",
      startDate: formData.startDate ? "" : "Start date is required",
      endDate: datesCheck.valid ? "" : datesCheck.error,
      selectedDestinations: destinationsValid
        ? ""
        : "Please select at least one destination",
    });

    return (
      nameValid &&
      emailValid &&
      phoneValid &&
      addressValid &&
      budgetValid &&
      datesCheck.valid &&
      destinationsValid
    );
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
    formData.selectedDestinations.forEach((dest) => {
      data.append("selectedDestinations", dest);
    });

    try {
      await dispatch(
        bookGuideThunk(destinationId!, data, guide?._id!, currentUser?.id!)
      );
      toast.success("Guide Booked");
      navigate(-1)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        console.error(error.response?.data ?? error.message);
      } else {
        toast.error("Cannot Book the guide")
        console.error("Unexpected error:", error);
      }
    };
  };

  // -------------------------------
  // UI
  // -------------------------------
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
            <GuideInfo guide={guide} />
            <DestinationSelector
              guide={guide}
              selectedDestinations={formData.selectedDestinations}
              onSelect={handleDestinationSelect}
              error={errors.selectedDestinations}
            />
            <BookingForm
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onDateChange={handleDateChange}
              onNumberChange={handleNumberChange}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <p className="text-center">Guide not found.</p>
        )}
      </section>
    </>
  );
}
