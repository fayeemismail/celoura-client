import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { AppDispatch, RootState } from "../../redux/store";
import Navbar from "../../components/user/home/Navbar";
import {
  bookGuideThunk,
  getGuideDataOnBookingThunk,
  getUserAddressesThunk,
} from "../../redux/user/userThunks";

import GuideInfo from "../../components/user/Destination/GuideInfo";
import DestinationSelector from "../../components/user/Destination/DestinationSelector";
import BookingForm from "../../components/user/Destination/BookingForm";

import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
  validateDates,
} from "../../components/user/Destination/Validation";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import AddressModal, { Address } from "../../components/user/Destination/AddressModal";

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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    addressId: "",
    startDate: "",
    endDate: "",
    days: 1,
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
    selectedDestinations: "",
  });

  const { isAuthenticated, error, currentUser } = useSelector(
    (state: RootState) => state.user
  );

  const getUserAddresses = async () => {
    try {
      const response = await dispatch(getUserAddressesThunk(currentUser?.id!));
      setAddresses(response);
      
      if (response.length > 0) {
        const firstAddress = response[0];
        const fullAddress = `${firstAddress.line1}${firstAddress.line2 ? ', ' + firstAddress.line2 : ''}, ${firstAddress.city}, ${firstAddress.state}, ${firstAddress.country}, ${firstAddress.postalCode}`;
        
        setFormData(prev => ({
          ...prev,
          address: fullAddress,
          addressId: firstAddress._id,
          name: firstAddress.name,
          phone: firstAddress.phone
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getGuideDetails = async () => {
    setLoading(true);
    try {
      if (guideId) {
        const data = await dispatch(getGuideDataOnBookingThunk(guideId));
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
    getUserAddresses();
  }, [isAuthenticated, guideId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    } else if (name === "selectedAddress") {
      if (value === "new") {
        setShowAddressModal(true);
      } else {
        const selectedAddress = addresses.find(addr => addr._id === value);
        if (selectedAddress) {
          const fullAddress = `${selectedAddress.line1}${selectedAddress.line2 ? ', ' + selectedAddress.line2 : ''}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}, ${selectedAddress.postalCode}`;
          
          setFormData(prev => ({
            ...prev,
            address: fullAddress,
            addressId: selectedAddress._id,
            name: selectedAddress.name,
            phone: selectedAddress.phone
          }));
        }
      }
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

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

  const validateForm = () => {
    const nameValid = validateName(formData.name);
    const emailValid = validateEmail(formData.email);
    const phoneValid = validatePhone(formData.phone);
    const addressValid = validateAddress(formData.address);
    const datesCheck = validateDates(formData.startDate, formData.endDate);
    const destinationsValid = formData.selectedDestinations.length > 0;

    setErrors({
      name: nameValid ? "" : "Name must be between 3 and 45 characters",
      email: emailValid ? "" : "Please enter a valid email address",
      phone: phoneValid
        ? ""
        : "Phone number must be at least 10 digits and contain only numbers",
      address: addressValid ? "" : "Address must be at least 10 characters",
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
    data.append("addressId", formData.addressId);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("days", formData.days.toString());
    data.append("specialRequests", formData.specialRequests);
    formData.selectedDestinations.forEach((dest) => {
      data.append("selectedDestinations", dest);
    });

    try {
      await dispatch(
        bookGuideThunk(destinationId!, data, guide?._id!, currentUser?.id!)
      );
      toast.success("Guide Booked");
      navigate(-1);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
        console.error(error.response?.data.message);
      } else {
        toast.error("Cannot Book the guide");
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleNewAddressCreated = async () => {
    await getUserAddresses();
    
    if (addresses.length > 0) {
      const latestAddress = addresses[addresses.length - 1];
      const fullAddress = `${latestAddress.line1}${latestAddress.line2 ? ', ' + latestAddress.line2 : ''}, ${latestAddress.city}, ${latestAddress.state}, ${latestAddress.country}, ${latestAddress.postalCode}`;
      
      setFormData(prev => ({
        ...prev,
        address: fullAddress,
        addressId: latestAddress._id,
        name: latestAddress.name,
        phone: latestAddress.phone
      }));
    }
    
    setShowAddressModal(false);
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
            <GuideInfo guide={guide} />
            <DestinationSelector
              guide={guide}
              selectedDestinations={formData.selectedDestinations}
              onSelect={handleDestinationSelect}
              error={errors.selectedDestinations}
            />
            
            {/* Address Selector */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Select Address</h3>
              <div className="mb-4">
                <select
                  name="selectedAddress"
                  value={formData.addressId || ""}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9B8759] focus:border-[#9B8759]"
                >
                  <option value="">Select an address</option>
                  {addresses.map(address => (
                    <option key={address._id} value={address._id}>
                      {address.name} - {address.line1}, {address.city}
                    </option>
                  ))}
                  <option value="new">+ Create new address</option>
                </select>
              </div>
              
              {formData.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Selected Address:</p>
                  <p>{formData.address}</p>
                </div>
              )}
            </div>
            
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
        
        {/* Address Modal */}
        {showAddressModal && (
          <AddressModal
            userId={currentUser?.id!}
            onClose={() => setShowAddressModal(false)}
            onAddressCreated={handleNewAddressCreated}
          />
        )}
      </section>
    </>
  );
}