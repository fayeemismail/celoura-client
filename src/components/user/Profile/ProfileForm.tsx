import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { handleUpdateProfile } from "../../../redux/user/userThunks";
import { validatePasswords } from "../../../validator/PasswordValidator";
import NameField from "./NameField";
import PasswordSection from "./PasswordSection";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";

export default function ProfileForm() {
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState(currentUser?.name || "");
  const [formError, setFormError] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!currentUser) {
      toast.error("User not logged in.");
      return;
    }

    const changes: any = { id: currentUser.id };

    if (name.trim() && name.trim() !== currentUser.name) {
      changes.name = name.trim();
    }

    if (showPasswordFields) {
      const result = validatePasswords({
        current: passwordData.current,
        new: passwordData.new,
        confirm: passwordData.confirm,
      });

      if (!result.success) {
        setFormError(result.message || "Invalid password input.");
        toast.error(result.message || "Invalid password input.");
        return;
      }

      Object.assign(changes, {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
        confirmPassword: passwordData.confirm,
      });
    }

    if (Object.keys(changes).length <= 1) {
      toast.info("No changes detected.");
      return;
    }

    try {
      await dispatch(handleUpdateProfile(changes));
      toast.success("Profile updated successfully.");
      setPasswordData({
        current: "",
        new: "",
        confirm: "",
        showCurrent: false,
        showNew: false,
        showConfirm: false,
      });
      setShowPasswordFields(false);
    } catch (err: any) {
      setFormError(err?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-[#e0d8c3] shadow-sm">
        {formError && (
          <div className="mb-6 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <NameField value={name} onChange={setName} />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <div className="text-base text-gray-800 px-4 py-3 border border-gray-300 rounded-md bg-gray-50">
              {currentUser?.email}
            </div>
          </div>
        </div>

        <PasswordSection
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          showPasswordFields={showPasswordFields}
          setShowPasswordFields={setShowPasswordFields}
        />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <SubmitButton loading={loading} />
        </div>
      </form>
    </div>
  );
}