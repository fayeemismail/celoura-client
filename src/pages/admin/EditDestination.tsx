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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              <input
                type="text"
                name="name"
                placeholder="Destination Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 h-28 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 rounded bg-[#1A1F2C] border border-gray-600"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
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
                disabled={!isFormChanged() || loading}
                className={`px-4 py-2 rounded transition ${
                  !isFormChanged() || loading
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
