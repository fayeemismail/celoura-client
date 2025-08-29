import { useEffect, useState } from "react";
import { countries } from "country-data";
import { addNewAddressThunk, getUserAddressesThunk } from "../../../redux/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    if(!isAuthenticated) navigate('/login')
    fetchAddresses();
  }, [isAuthenticated,]);

  const fetchAddresses = async () => {
    try {
      const response = await dispatch(getUserAddressesThunk(currentUser?.id!));
      setAddresses(response);
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.length < 3 || form.name.length > 43)
      newErrors.name = "Name must be 3-43 characters long.";
    if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone must be exactly 10 digits.";
    if (form.line1.length < 8 || form.line1.length > 43)
      newErrors.line1 = "Address Line 1 must be 8-43 characters long.";
    if (!form.city) newErrors.city = "City is required.";
    if (form.city.length < 3 || form.city.length > 43) newErrors.city = "City name must be more than 3 charecters and less than 43";
    if (!form.state) newErrors.state = "State is required.";
    if (form.state.length < 3 || form.state.length > 43) newErrors.state = "State name must be more than 3 charecters and less than 43";
    if (!form.country) newErrors.country = "Country is required.";
    if (!/^\d{6}$/.test(form.postalCode))
      newErrors.postalCode = "Postal Code must be exactly 6 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });

      await dispatch(addNewAddressThunk(formData));
      fetchAddresses();
      setShowForm(false);
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    setForm({ ...form, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#5a3921]">Manage Addresses</h1>

      {/* No addresses state */}
      {addresses.length === 0 && !showForm && (
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
            onClick={() => setShowForm(true)}
            className="bg-[#8b7355] hover:bg-[#6d5942] text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Add Your First Address
          </button>
        </div>
      )}

      {/* List of addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-[#5a3921] mb-4">Your Addresses</h2>
          {addresses.map((addr) => (
            <div key={addr._id} className="bg-[#f8f5ef] p-5 rounded-lg border border-[#e8d9c0] transition-shadow hover:shadow-md">
              <p className="font-semibold text-lg text-[#5a3921] mb-2">{addr.name}</p>
              <p className="text-gray-700 mb-2">{addr.line1}, {addr.line2 && `${addr.line2},`}</p>
              <p className="text-gray-700 mb-2">{addr.city}, {addr.state}, {addr.country}</p>
              <p className="text-gray-700 flex items-center gap-2">
                <span>📞 {addr.phone}</span>
                <span className="mx-2">•</span>
                <span>📮 {addr.postalCode}</span>
              </p>
              <div className="mt-4 flex gap-3">
                <button className="text-[#8b7355] hover:text-[#6d5942] text-sm font-medium">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toggle form button when addresses exist */}
      {addresses.length > 0 && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#8b7355] hover:bg-[#6d5942] text-white px-4 py-2 rounded-lg mb-6 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add New Address"}
        </button>
      )}

      {/* Address Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#f8f5ef] p-6 rounded-lg border border-[#e8d9c0] space-y-5"
        >
          <h2 className="text-xl font-semibold text-[#5a3921] mb-2">Add New Address</h2>
          
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8b7355] hover:bg-[#6d5942] disabled:bg-gray-400 text-white px-6 py-3 rounded-lg w-full transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      )}
    </div>
  );
}