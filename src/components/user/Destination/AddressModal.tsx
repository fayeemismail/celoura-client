import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addNewAddressThunk } from "../../../redux/user/userThunks";
import { AppDispatch } from "../../../redux/store";
import { countries } from "country-data";

export interface Address {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface AddressModalProps {
  userId: string;
  onClose: () => void;
  onAddressCreated: () => void; 
}

export default function AddressModal({ userId, onClose, onAddressCreated }: AddressModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const uniqueCountries = Array.from(
    new Set(countries.all.map((c) => c.name))
  ).sort();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (form.name.trim().length < 3 || form.name.trim().length > 43) 
      newErrors.name = "Name must be between 3 to 43 characters";
    if (!/^\d{10}$/.test(form.phone.trim())) 
      newErrors.phone = "Phone must be exactly 10 digits";
    if (form.line1.trim().length < 5 || form.line1.trim().length > 100) 
      newErrors.line1 = "Address line 1 must be between 5 to 100 characters";
    if (form.city.trim().length < 2 || form.city.trim().length > 43) 
      newErrors.city = "City must be between 2 to 43 characters";
    if (form.state.trim().length < 2 || form.state.trim().length > 43) 
      newErrors.state = "State must be between 2 to 43 characters";
    if (form.country.trim().length < 2) 
      newErrors.country = "Country is required";
    if (!/^\d{6}$/.test(form.postalCode.trim())) 
      newErrors.postalCode = "Postal code must be exactly 6 digits";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    if (value.length <= 43) {
      handleInputChange('name', value);
    }
  };

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      handleInputChange('phone', numericValue);
    }
  };

  const handleLine1Change = (value: string) => {
    if (value.length <= 100) {
      handleInputChange('line1', value);
    }
  };

  const handleLine2Change = (value: string) => {
    if (value.length <= 100) {
      handleInputChange('line2', value);
    }
  };

  const handleCityChange = (value: string) => {
    if (value.length <= 43) {
      handleInputChange('city', value);
    }
  };

  const handleStateChange = (value: string) => {
    if (value.length <= 43) {
      handleInputChange('state', value);
    }
  };

  const handlePostalCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      handleInputChange('postalCode', numericValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries({ ...form, userId }).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      await dispatch(addNewAddressThunk(formData));
      toast.success("Address added successfully");
      
      onAddressCreated();
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Address</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={43}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            <p className="text-xs text-gray-500 mt-1">{form.name.length}/43 characters</p>
          </div>
          
          {/* Phone + Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={10}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              <p className="text-xs text-gray-500 mt-1">{form.phone.length}/10 digits</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code *</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              <p className="text-xs text-gray-500 mt-1">{form.postalCode.length}/6 digits</p>
            </div>
          </div>
          
          {/* Address Lines */}
          <div>
            <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
            <input
              type="text"
              value={form.line1}
              onChange={(e) => handleLine1Change(e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.line1 ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={100}
            />
            {errors.line1 && <p className="text-red-500 text-sm mt-1">{errors.line1}</p>}
            <p className="text-xs text-gray-500 mt-1">{form.line1.length}/100 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
            <input
              type="text"
              value={form.line2}
              onChange={(e) => handleLine2Change(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{form.line2.length}/100 characters</p>
          </div>
          
          {/* City / State / Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={43}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              <p className="text-xs text-gray-500 mt-1">{form.city.length}/43 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={43}
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              <p className="text-xs text-gray-500 mt-1">{form.state.length}/43 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <select
                value={form.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#9B8759] focus:border-[#9B8759] ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Country</option>
                {uniqueCountries.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#9B8759] hover:bg-[#7a6a4a] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              {isSubmitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}