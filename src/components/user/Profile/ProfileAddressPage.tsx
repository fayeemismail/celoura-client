import { useEffect, useState, useRef } from "react";
import { countries } from "country-data";
import { 
  addNewAddressThunk, 
  getUserAddressesThunk, 
  editUserAddressThunk, 
  deleteUserAddress
} from "../../../redux/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationDialog from "../../common/ConfirmationDialog";

interface Address {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export default function ProfileAddressesPage() {
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<Address>({
    name: "",
    phone: "",
    userId: currentUser?.id!,
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialFormRef = useRef<Address | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    fetchAddresses();
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      const response = await dispatch(getUserAddressesThunk(currentUser?.id!));
      setAddresses(response);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch addresses");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedLine1 = form.line1.trim();
    const trimmedCity = form.city.trim();
    const trimmedState = form.state.trim();
    const trimmedCountry = form.country.trim();
    const trimmedPostalCode = form.postalCode.trim();

    if (trimmedName.length < 3 || trimmedName.length > 43)
      newErrors.name = "Name must between 3 to 43 characters long.";
    if (!/^\d{10}$/.test(trimmedPhone))
      newErrors.phone = "Phone must be exactly 10 digits.";
    if (trimmedLine1.length < 8 || trimmedLine1.length > 43)
      newErrors.line1 = "Address Line 1 must between 8 tot 43 characters long.";
    if (!trimmedCity) newErrors.city = "City is required.";
    if (trimmedCity.length < 3 || trimmedCity.length > 43) newErrors.city = "City name must be more than 3 characters and less than 43";
    if (!trimmedState) newErrors.state = "State is required.";
    if (trimmedState.length < 3 || trimmedState.length > 43) newErrors.state = "State name must be more than 3 characters and less than 43";
    if (!trimmedCountry) newErrors.country = "Country is required.";
    if (!/^\d{6}$/.test(trimmedPostalCode))
      newErrors.postalCode = "Postal Code must be exactly 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && !isFormDirty) {
      toast.info("No changes detected");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const trimmedForm = {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2?.trim() || "",
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        postalCode: form.postalCode.trim()
      };

      const formData = new FormData();
      Object.entries(trimmedForm).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });

      if (isEditing && form._id) {
        await dispatch(editUserAddressThunk(form._id, formData));
        toast.success("Address updated successfully");
      } else {
        await dispatch(addNewAddressThunk(formData));
        toast.success("Address added successfully");
      }
      
      fetchAddresses();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    setForm({ ...form, [field]: value });

    const initialValue = initialFormRef.current?.[field] || "";
    const isChanged = value.trim() !== initialValue.toString().trim();
    
    setIsFormDirty(isChanged);

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const openModal = () => {
    setIsEditing(false);
    setShowModal(true);
    setErrors({});
    setIsFormDirty(false);

    initialFormRef.current = {
      name: "",
      phone: "",
      userId: currentUser?.id!,
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    };
  };

  const confirmDelete = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;
    
    try {
      await dispatch(deleteUserAddress(addressToDelete));
      toast.success("Address deleted successfully");
      fetchAddresses(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
    } finally {
      setDeleteConfirmOpen(false);
      setAddressToDelete(null);
    }
  };

  const openEditModal = (address: Address) => {
    setForm({ ...address });
    setIsEditing(true);
    setShowModal(true);
    setErrors({});
    setIsFormDirty(false);
    

    initialFormRef.current = { ...address };
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      userId: currentUser?.id!,
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });
    setErrors({});
    setIsEditing(false);
    setIsFormDirty(false);
    initialFormRef.current = null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
 
      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        title="Delete Address"
        message="Are you sure you want to delete this address?"
        color="#dc2626" 
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setAddressToDelete(null);
        }}
        zIndex={60}
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5a3921]">Manage Addresses</h1>
        {addresses.length > 0 && (
          <button
            onClick={openModal}
            className="bg-[#8b7355] hover:bg-[#6d5942] text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Add New Address
          </button>
        )}
      </div>


      {addresses.length === 0 && (
        <div className="bg-[#f8f5ef] p-8 rounded-lg shadow-sm text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-[#e8d9c0] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#8b7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#5a3921] mb-2">No addresses yet</h2>
          <p className="text-gray-600 mb-6">Add your first address to get started</p>
          <button
            onClick={openModal}
            className="bg-[#8b7355] hover:bg-[#6d5942] text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Add Your First Address
          </button>
        </div>
      )}


      {addresses.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {addresses.map((addr) => (
              <div key={addr._id} className="bg-[#f8f5ef] p-5 rounded-lg border border-[#e8d9c0] transition-shadow hover:shadow-md h-full flex flex-col">
                <div className="flex-grow">
                  <p className="font-semibold text-lg text-[#5a3921] mb-2">{addr.name}</p>
                  <p className="text-gray-700 mb-2 text-sm">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                  <p className="text-gray-700 mb-2 text-sm">{addr.city}, {addr.state}, {addr.country}</p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Phone:</span> {addr.phone}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Postal Code:</span> {addr.postalCode}
                  </p>
                </div>
                <div className="mt-4 flex gap-3 pt-3 border-t border-[#e8d9c0]">
                  <button 
                    onClick={() => openEditModal(addr)}
                    className="text-[#8b7355] hover:text-[#6d5942] text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => confirmDelete(addr._id!)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add New Address Card */}
            <div 
              onClick={openModal}
              className="bg-[#f8f5ef] border-2 border-dashed border-[#8b7355] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-[#f0e9dd] h-full"
            >
              <div className="w-12 h-12 bg-[#e8d9c0] rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8b7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-[#5a3921] font-medium">Add New Address</p>
            </div>
          </div>
        </div>
      )}

      {showModal && (
       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-[#5a3921]">
                {isEditing ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    placeholder="10-digit phone number"
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    placeholder="6-digit postal code"
                    value={form.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="Street address, P.O. box, company name"
                  value={form.line1}
                  onChange={(e) => handleInputChange('line1', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.line1 ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.line1 && <p className="text-red-500 text-sm mt-1">{errors.line1}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={form.line2}
                  onChange={(e) => handleInputChange('line2', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    value={form.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#8b7355] focus:border-[#8b7355] ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Country</option>
                    {countries.all.map((c, idx) => (
                      <option key={`${c.alpha2}-${idx}`} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (isEditing && !isFormDirty)}
                  className="flex-1 bg-[#8b7355] hover:bg-[#6d5942] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Address' : 'Save Address')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}