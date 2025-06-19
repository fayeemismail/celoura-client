import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/home/AdminSidebar";
import AdminHeader from "../../components/admin/home/AdminHeader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { createDestination } from "../../redux/admin/authThunks";
import ImageUploader from "../../components/common/ImageUploader";

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
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file: File, index: number) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = file;
      return { ...prev, photos: newPhotos };
    });
    setErrors(prev => ({ ...prev, photos: "" }));
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
      .map(f => f.trim())
      .filter(Boolean);
    const validPhotos = formData.photos.filter((file): file is File => file !== null);

    const newErrors = {
      name: name ? "" : "Name cannot be empty.",
      description: description ? "" : "Description cannot be empty.",
      location: location ? "" : "Location cannot be empty.",
      country: country ? "" : "Country cannot be empty.",
      photos: validPhotos.length > 0 ? "" : "At least one photo is required.",
      features: features.length > 0 ? "" : "Please add at least one feature.",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg !== "")) {
      setLoading(false);
      return;
    }

    const formPayload = new FormData();
    formPayload.append("name", name);
    formPayload.append("description", description);
    formPayload.append("location", location);
    formPayload.append("country", country);
    formPayload.append("features", JSON.stringify(features));
    validPhotos.forEach(photo => formPayload.append("photos", photo));

    try {
      await dispatch(createDestination(formPayload));
      toast.success("Destination created!");
      navigate("/admin/destinations");
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message || err?.message || "Something went wrong!";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() &&
    formData.description.trim() &&
    formData.location.trim() &&
    formData.country.trim() &&
    formData.photos.some((file) => file !== null) &&
    formData.featureInput
      .split(",")
      .map(f => f.trim())
      .filter(Boolean).length > 0;

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
                  placeholder="Destination Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${errors.name ? "border-red-500" : "border-gray-600"}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-2 h-28 rounded bg-[#1A1F2C] border ${errors.description ? "border-red-500" : "border-gray-600"}`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${errors.location ? "border-red-500" : "border-gray-600"}`}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${errors.country ? "border-red-500" : "border-gray-600"}`}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="featureInput"
                  placeholder="Features (comma separated)"
                  value={formData.featureInput}
                  onChange={handleChange}
                  className={`w-full p-2 rounded bg-[#1A1F2C] border ${errors.features ? "border-red-500" : "border-gray-600"}`}
                />
                {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
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
