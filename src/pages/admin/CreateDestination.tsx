import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import ImageUploader from "../../components/common/ImageUploader";
import { createDestination, uploadDestinationPhotos } from "../../redux/admin/authThunks";
import Select from 'react-select';
import { countries } from 'country-data';

const countryOptions = Object.values(countries.all).map(country => ({
  value: country.name,
  label: country.name
}));

export default function CreateDestination() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    photos: [null, null, null, null] as (File | null)[],
    description: "",
    location: "",
    country: "",
    featureInput: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    location: "",
    country: "",
    photos: "",
    features: "",
  });

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
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file: File, index: number) => {
    setFormData((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = file;
      return { ...prev, photos: newPhotos };
    });
    setErrors((prev) => ({ ...prev, photos: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const name = formData.name.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const country = formData.country.trim();
    const features = formData.featureInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const validPhotos = formData.photos.filter((file): file is File => file !== null);

    // Add character limit validation to the submission check
    const newErrors = {
      name: name ? (name.length > 58 ? "Name cannot exceed 58 characters" : "") : "Name cannot be empty.",
      description: description ? "" : "Description cannot be empty.",
      location: location ? (location.length > 58 ? "Location cannot exceed 58 characters" : "") : "Location cannot be empty.",
      country: country ? "" : "Country cannot be empty.",
      photos: validPhotos.length > 0 ? "" : "At least one photo is required.",
      features: features.length > 0 ? (features.some(f => f.length > 58) ? "Each feature cannot exceed 58 characters" : "") : "Please add at least one feature.",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg !== "")) {
      setLoading(false);
      return;
    }

    try {
      const uploadedPhotoUrls = await dispatch(uploadDestinationPhotos(validPhotos))

      // 2. Create destination with the photo URLs
      await dispatch(createDestination({
        name,
        description,
        location,
        country,
        features,
        photos: uploadedPhotoUrls
      }))

      toast.success("Destination created!");
      navigate("/admin/destinations");
    } catch (err: any) {
      const backendMessage = err.payload || err.message || "Something went wrong!";
      toast.error(backendMessage);
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

  const isFormValid =
    formData.name.trim() &&
    formData.name.length <= 58 &&
    formData.description.trim() &&
    formData.location.trim() &&
    formData.location.length <= 58 &&
    formData.country.trim() &&
    formData.photos.some((file) => file !== null) &&
    formData.featureInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean).length > 0 &&
    featuresValid;

  return (
    <div style={{ backgroundColor: "#1A1F2C" }} className="flex min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader />
        <div className="p-6">
          <div className="bg-[#242A38] p-6 rounded shadow text-white">
            <h2 className="text-2xl font-semibold mb-6">Create Destination</h2>

            <div className="flex flex-wrap gap-12 mb-6">
              {formData.photos.map((file, index) => (
                <ImageUploader
                  key={index}
                  index={index}
                  file={file}
                  onChange={handleImageChange}
                />
              ))}
              {errors.photos && (
                <p className="text-red-500 text-sm mt-1 w-full">{errors.photos}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-2 h-28 rounded bg-[#1A1F2C] border ${
                    errors.description ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

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

              <div>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(opt => opt.value === formData.country)}
                  onChange={(selectedOption) => {
                    setFormData(prev => ({ ...prev, country: selectedOption?.value || "" }));
                    setErrors(prev => ({ ...prev, country: "" }));
                  }}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select country..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#1A1F2C',
                      borderColor: errors.country ? '#ef4444' : '#4b5563',
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
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
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
                className={`px-4 py-2 rounded transition-colors ${
                  !isFormValid || loading
                    ? "bg-blue-600 opacity-50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}