import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { toast } from "react-toastify";
import ImageUploader from "../../components/common/ImageUploader";
import {
  getDestinationByIdThunk,
  updateDestinationThunk,
} from "../../redux/admin/authThunks";
import Select from 'react-select';
import { countries } from 'country-data';

const countryOptions = Object.values(countries.all).map(country => ({
  value: country.name,
  label: country.name
}));

export default function EditDestination() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    photos: [null, null, null, null] as (string | File | null)[],
    description: "",
    location: "",
    country: "",
    featureInput: "",
  });
  const [originalData, setOriginalData] = useState<typeof formData | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    location: "",
    features: "",
  });
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getDestinationByIdThunk(id!));
        const { name, description, location, country, features, photos } = response.data;
        const fetchedPhotos = [...photos, null, null, null, null].slice(0, 4);

        const fetchedData = {
          name,
          description,
          location,
          country,
          featureInput: features.join(", "),
          photos: fetchedPhotos,
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
        setExistingPhotoUrls(photos);
      } catch {
        toast.error("Failed to load destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Add character limit validation for name and location
    if (name === "name" && value.length > 58) {
      setErrors((prev) => ({ ...prev, name: "Name cannot exceed 58 characters" }));
      return;
    }
    
    if (name === "location" && value.length > 58) {
      setErrors((prev) => ({ ...prev, location: "Location cannot exceed 58 characters" }));
      return;
    }
    
    // Validate features
    if (name === "featureInput") {
      const features = value.split(",").map(f => f.trim()).filter(Boolean);
      if (features.some(f => f.length > 58)) {
        setErrors((prev) => ({ ...prev, features: "Each feature cannot exceed 58 characters" }));
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file: File, index: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = file;
      return { ...prev, photos: newPhotos };
    });
  };

  const isFormChanged = (): boolean => {
    if (!originalData) return false;
    const cleanedPhotos = formData.photos.map((p) => (p instanceof File ? "new" : p));
    const originalPhotos = originalData.photos.map((p) => (p instanceof File ? "new" : p));

    return (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.location !== originalData.location ||
      formData.country !== originalData.country ||
      formData.featureInput !== originalData.featureInput ||
      JSON.stringify(cleanedPhotos) !== JSON.stringify(originalPhotos)
    );
  };

  const validateForm = (): boolean => {
    const { name, description, location, country, featureInput } = formData;

    // Clear previous errors
    setErrors({
      name: "",
      location: "",
      features: "",
    });

    const isEmpty = (value: string) => value.trim() === "";
    const isTooShort = (value: string) => value.trim().length < 3;
    const hasOnlySpecialOrNumbers = (value: string) => /^[^a-zA-Z]+$/.test(value);
    const hasNumbersOrSpecials = (value: string) => /[^a-zA-Z\s,]/.test(value);

    const fields = [
      { label: "Name", value: name },
      { label: "Description", value: description },
      { label: "Location", value: location },
      { label: "Country", value: country },
      { label: "Features", value: featureInput },
    ];

    for (const { label, value } of fields) {
      if (isEmpty(value)) {
        toast.error(`${label} cannot be empty`);
        return false;
      }
      if (isTooShort(value)) {
        toast.error(`${label} must be at least 3 letters`);
        return false;
      }
      if (hasOnlySpecialOrNumbers(value)) {
        toast.error(`${label} must contain alphabet characters`);
        return false;
      }
    }

    // Check character limits
    if (name.length > 58) {
      setErrors(prev => ({ ...prev, name: "Name cannot exceed 58 characters" }));
      toast.error("Name cannot exceed 58 characters");
      return false;
    }

    if (location.length > 58) {
      setErrors(prev => ({ ...prev, location: "Location cannot exceed 58 characters" }));
      toast.error("Location cannot exceed 58 characters");
      return false;
    }

    // Check if any feature exceeds 58 characters
    const features = featureInput.split(",").map(f => f.trim()).filter(Boolean);
    if (features.some(f => f.length > 58)) {
      setErrors(prev => ({ ...prev, features: "Each feature cannot exceed 58 characters" }));
      toast.error("Each feature cannot exceed 58 characters");
      return false;
    }

    if (hasNumbersOrSpecials(country)) {
      toast.error("Country must not contain numbers or special characters");
      return false;
    }

    if (featureInput.split(",").some((f) => hasNumbersOrSpecials(f.trim()))) {
      toast.error("Features must not contain numbers or special characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !originalData) return;

    const hasAnyPhoto = formData.photos.some(
      (p) => p instanceof File || (typeof p === "string" && p.trim() !== "")
    );

    if (!hasAnyPhoto) {
      toast.error("At least one photo is required.");
      return;
    }

    setLoading(true);

    const formPayload = new FormData();

    if (formData.name.trim() !== originalData.name) {
      formPayload.append("name", formData.name.trim());
    }

    if (formData.description.trim() !== originalData.description) {
      formPayload.append("description", formData.description.trim());
    }

    if (formData.location.trim() !== originalData.location) {
      formPayload.append("location", formData.location.trim());
    }

    if (formData.country.trim() !== originalData.country) {
      formPayload.append("country", formData.country.trim());
    }

    const features = formData.featureInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const originalFeatures = originalData.featureInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (JSON.stringify(features) !== JSON.stringify(originalFeatures)) {
      formPayload.append("features", JSON.stringify(features));
    }

    const currentPhotoUrls = formData.photos.filter(
      (p) => typeof p === "string"
    ) as string[];

    const deletedPhotos = existingPhotoUrls.filter(
      (url) => !currentPhotoUrls.includes(url)
    );

    if (deletedPhotos.length > 0) {
      formPayload.append("deletedPhotos", JSON.stringify(deletedPhotos));
    }

    formData.photos.forEach((photo) => {
      if (photo instanceof File) {
        formPayload.append("photos", photo);
      }
    });

    try {
      const data = await dispatch(updateDestinationThunk(id!, formPayload));
      toast.success(data.message ? data.message : "Destination updated successfully!");
      navigate('/admin/destinations');
    } catch {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Check if any feature exceeds 58 characters
  const featuresValid = formData.featureInput
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean)
    .every(f => f.length <= 58);

  const isFormValid = isFormChanged() && 
    formData.name.length <= 58 && 
    formData.location.length <= 58 && 
    featuresValid;

  return (
    <div className="flex min-h-screen bg-[#1A1F2C]">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <AdminSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <AdminHeader /> 
        <div className="p-6 text-white">
          <div className="bg-[#242A38] p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-6">Edit Destination</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {formData.photos.map((photo, index) => (
                  <ImageUploader
                    key={index}
                    index={index}
                    file={photo}
                    onChange={handleImageChange}
                    onDelete={() => {
                      setFormData((prev) => {
                        const newPhotos = [...prev.photos];
                        newPhotos[index] = null;
                        return { ...prev, photos: newPhotos };
                      });
                    }}
                  />
                ))}
              </div>
              
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Destination Name (max 58 characters)"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={58}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  }`}
                />
                <div className="flex justify-between">
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  <p className="text-gray-400 text-sm mt-1 text-right">
                    {formData.name.length}/58 characters
                  </p>
                </div>
              </div>
              
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 h-28 rounded bg-[#1A1F2C] border border-gray-600"
              />
              
              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location (max 58 characters)"
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={58}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${
                    errors.location ? "border-red-500" : "border-gray-600"
                  }`}
                />
                <div className="flex justify-between">
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  <p className="text-gray-400 text-sm mt-1 text-right">
                    {formData.location.length}/58 characters
                  </p>
                </div>
              </div>
              
              {/* Country Select Dropdown */}
              <div>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(opt => opt.value === formData.country)}
                  onChange={(selectedOption) => {
                    setFormData(prev => ({ ...prev, country: selectedOption?.value || "" }));
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select country..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#1A1F2C',
                      borderColor: '#4b5563',
                      color: 'white'
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'white'
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#242A38'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#1A1F2C' : '#242A38',
                      color: 'white'
                    })
                  }}
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="featureInput"
                  placeholder="Features (comma separated, max 58 characters each)"
                  value={formData.featureInput}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${
                    errors.features ? "border-red-500" : "border-gray-600"
                  }`}
                />
                <div className="flex justify-between">
                  {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
                  <p className="text-gray-400 text-sm mt-1 text-right">
                    Each feature max 58 characters
                  </p>
                </div>
                {formData.featureInput && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-1">Features preview:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.featureInput
                        .split(",")
                        .map((f) => f.trim())
                        .filter(Boolean)
                        .map((feature, index) => (
                          <span 
                            key={index} 
                            className={`px-2 py-1 rounded text-sm ${
                              feature.length > 58 
                                ? "bg-red-900 text-red-200" 
                                : "bg-blue-900 text-blue-200"
                            }`}
                          >
                            {feature} {feature.length > 58 && "❌"}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`px-4 py-2 rounded transition ${
                  !isFormValid || loading
                    ? "bg-blue-600 opacity-50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Update Destination
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}