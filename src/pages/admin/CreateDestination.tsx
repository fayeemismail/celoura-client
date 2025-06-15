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
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    photos: [null, null, null, null] as (File | null)[],
    description: "",
    location: "",
    country: "",
    featureInput: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File, index: number) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = file;
      return { ...prev, photos: newPhotos };
    });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // Trimmed values
  const name = formData.name.trim();
  const description = formData.description.trim();
  const location = formData.location.trim();
  const country = formData.country.trim();
  const features = formData.featureInput
    .split(",")
    .map(f => f.trim())
    .filter(Boolean);

  const validPhotos = formData.photos.filter((file): file is File => file !== null);

  // Frontend validation
  if (!name) {
    toast.error("Name cannot be empty.");
    setLoading(false);
    return;
  }
  if (!description) {
    toast.error("Description cannot be empty.");
    setLoading(false);
    return;
  }
  if (!location) {
    toast.error("Location cannot be empty.");
    setLoading(false);
    return;
  }
  if (!country) {
    toast.error("Country cannot be empty.");
    setLoading(false);
    return;
  }
  if (validPhotos.length === 0) {
    toast.error("At least one photo is required.");
    setLoading(false);
    return;
  }
  if (features.length === 0) {
    toast.error("Please add at least one feature.");
    setLoading(false);
    return;
  }

  // Prepare FormData
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
    const backendMessage = err.response?.data?.message || err.message || "Something went wrong!";
    toast.error(backendMessage);
  } finally {
    setLoading(false);
  }
};



  return (
    <div style={{ backgroundColor: "#1A1F2C" }} className="flex min-h-screen">
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
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Destination Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-2 h-28 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <input
                type="text"
                name="featureInput"
                placeholder="Features (comma separated)"
                value={formData.featureInput}
                onChange={handleChange}
                className="w-full p-2 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
