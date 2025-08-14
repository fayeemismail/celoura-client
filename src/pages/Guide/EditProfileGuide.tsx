import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GuideSidebar from "../../components/guide/GuideSidebar";
import GuideNavbar from "../../components/guide/GuideNavbar";
import {
  getProfileGuide,
  updateProfileGuideThunk,
} from "../../redux/guide/authThunks";
import { Eye, EyeOff, User, X } from "lucide-react";

export default function EditProfile() {
  const { isAuthenticated, currentGuide } = useSelector(
    (state: RootState) => state.guide
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [existingProfilePicUrl, setExistingProfilePicUrl] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);
  const [newDestination, setNewDestination] = useState("");

  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [initialData, setInitialData] = useState({
    name: "",
    bio: "",
    profilePic: "",
    availableDestinations: [] as string[],
  });

  const [errors, setErrors] = useState({
    name: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newDestination: "",
  });

  const fetchGuide = async () => {
    try {
      const data = await dispatch(getProfileGuide(currentGuide?.id!));
      setName(data.name || "");
      setBio(data.bio || "");
      setExistingProfilePicUrl(data.profilePic || "");
      setAvailableDestinations(data.availableDestinations || []);
      setInitialData({
        name: data.name || "",
        bio: data.bio || "",
        profilePic: data.profilePic || "",
        availableDestinations: data.availableDestinations || [],
      });
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/guide/login");
    fetchGuide();
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const trimmedName = name.trim();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    let valid = true;

    const newErrors = {
      name: "",
      bio: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      newDestination: "",
    };

    if (!trimmedName) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (bio.length > 0 && !bio.trim()) {
      newErrors.bio = "Bio cannot be just spaces";
      valid = false;
    };

    if (changePassword) {
      if (!currentPassword.trim()) {
        newErrors.currentPassword = "Current password required";
        valid = false;
      }

      if (!newPassword.trim()) {
        newErrors.newPassword = "New password required";
        valid = false;
      } else if (
        newPassword.length < 8 ||
        !passwordRegex.test(newPassword)
      ) {
        newErrors.newPassword =
          "Must include upper, lower, number & special char";
        valid = false;
      }

      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password required";
        valid = false;
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }

      if (
        currentPassword &&
        newPassword &&
        confirmPassword &&
        currentPassword === newPassword &&
        newPassword === confirmPassword
      ) {
        newErrors.confirmPassword = "All passwords are the same";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const hasChanges = useMemo(() => {
    const trimmedName = name.trim();
    const initialName = initialData.name.trim();

    const nameChanged = trimmedName && trimmedName !== initialName;
    const bioChanged = bio !== initialData.bio;
    const destinationsChanged = 
      JSON.stringify(availableDestinations) !== JSON.stringify(initialData.availableDestinations);

    const profilePicChanged = !!profilePic;
    const profilePicRemoved =
      !profilePic &&
      existingProfilePicUrl === "" &&
      initialData.profilePic !== "";

    const passwordChanged =
      changePassword &&
      currentPassword.trim() &&
      newPassword.trim() &&
      confirmPassword.trim();

    return (
      nameChanged ||
      bioChanged ||
      destinationsChanged ||
      profilePicChanged ||
      profilePicRemoved ||
      passwordChanged
    );
  }, [
    name,
    bio,
    availableDestinations,
    profilePic,
    existingProfilePicUrl,
    changePassword,
    currentPassword,
    newPassword,
    confirmPassword,
    initialData,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("_id", currentGuide?.id || "");

    const trimmedName = name.trim();

    if (trimmedName !== initialData.name.trim()) {
      formData.append("name", trimmedName);
    }

    if (bio !== initialData.bio) {
      formData.append("bio", bio.trim());
    }

    if (JSON.stringify(availableDestinations) !== JSON.stringify(initialData.availableDestinations)) {
      formData.append("availableDestinations", JSON.stringify(availableDestinations));
    }

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    if (!existingProfilePicUrl && initialData.profilePic) {
      formData.append("removeProfilePic", "true");
    }

    if (changePassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);
    }

    try {
      await dispatch(updateProfileGuideThunk(formData));
      toast.success("Profile updated!");
      navigate("/guide/profile");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setProfilePic(e.dataTransfer.files[0]);
    }
  };

  const addDestination = () => {
    if (!newDestination.trim()) {
      setErrors({...errors, newDestination: "Destination cannot be empty"});
      return;
    }
    
    if (availableDestinations.includes(newDestination.trim())) {
      setErrors({...errors, newDestination: "Destination already exists"});
      return;
    }
    
    setAvailableDestinations([...availableDestinations, newDestination.trim()]);
    setNewDestination("");
    setErrors({...errors, newDestination: ""});
  };

  const removeDestination = (index: number) => {
    const updatedDestinations = [...availableDestinations];
    updatedDestinations.splice(index, 1);
    setAvailableDestinations(updatedDestinations);
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <GuideSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"
          }`}
      >
        <GuideNavbar />
        <main className="pt-24 px-6 pb-12">
          <div className="max-w-3xl mx-auto bg-[#111] border border-gray-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Edit Your Profile
            </h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div
                onClick={() =>
                  document.getElementById("profilePicInput")?.click()
                }
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:border-green-500 transition"
              >
                {profilePic ? (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="New"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : existingProfilePicUrl ? (
                  <img
                    src={existingProfilePicUrl}
                    alt="Current"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}

                {(profilePic || existingProfilePicUrl) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (profilePic) setProfilePic(null);
                      else setExistingProfilePicUrl("");
                    }}
                    className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-xs rounded-full px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-2">
                Click or drag image to upload
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-[#222] border rounded-lg px-4 py-2 ${errors.name ? "border-red-500" : "border-gray-600"
                    }`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full bg-[#222] border rounded-lg px-4 py-2 ${errors.bio ? "border-red-500" : "border-gray-600"
                    }`}
                  rows={3}
                  placeholder="Something about you"
                />
                {errors.bio && (
                  <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
                )}
              </div>

              {/* Available Destinations */}
              <div>
                <label className="block text-sm mb-1">Available Destinations</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className={`flex-1 bg-[#222] border rounded-lg px-4 py-2 ${errors.newDestination ? "border-red-500" : "border-gray-600"
                      }`}
                    placeholder="Add new destination"
                  />
                  <button
                    type="button"
                    onClick={addDestination}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                {errors.newDestination && (
                  <p className="text-red-500 text-xs mt-1">{errors.newDestination}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {availableDestinations.map((destination, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-gray-700 rounded-full px-3 py-1"
                    >
                      <span>{destination}</span>
                      <button
                        type="button"
                        onClick={() => removeDestination(index)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change Password */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Change Password?</label>
                <button
                  type="button"
                  onClick={() => setChangePassword(!changePassword)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${changePassword ? "bg-green-500" : "bg-gray-600"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${changePassword ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>

              {changePassword && (
                <>
                  {/* Current Password */}
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      className={`w-full bg-[#222] border rounded-lg px-4 py-2 pr-10 ${errors.currentPassword
                          ? "border-red-500"
                          : "border-gray-600"
                        }`}
                    />
                    {showCurrentPassword ? (
                      <EyeOff
                        onClick={() => setShowCurrentPassword(false)}
                        className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowCurrentPassword(true)}
                        className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-400"
                      />
                    )}
                    {errors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full bg-[#222] border rounded-lg px-4 py-2 pr-10 ${errors.newPassword
                          ? "border-red-500"
                          : "border-gray-600"
                        }`}
                    />
                    {showNewPassword ? (
                      <EyeOff
                        onClick={() => setShowNewPassword(false)}
                        className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowNewPassword(true)}
                        className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-400"
                      />
                    )}
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      className={`w-full bg-[#222] border rounded-lg px-4 py-2 pr-10 ${errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-600"
                        }`}
                    />
                    {showConfirmPassword ? (
                      <EyeOff
                        onClick={() => setShowConfirmPassword(false)}
                        className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-400"
                      />
                    ) : (
                      <Eye
                        onClick={() => setShowConfirmPassword(true)}
                        className="absolute right-3 top-3 h-5 w-5 cursor-pointer text-gray-400"
                      />
                    )}
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!hasChanges}
                className={`w-full py-2 rounded-lg font-medium transition ${hasChanges
                    ? "bg-[#09b86c] hover:bg-[#07a05e]"
                    : "bg-gray-700 cursor-not-allowed"
                  }`}
              >
                Save Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}