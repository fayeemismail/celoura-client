// /components/user/Profile/ProfileForm.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { handleUpdateProfile } from "../../../redux/user/userThunks";
import { validatePasswords } from "../../../validator/PasswordValidator";
import NameField from "./NameField";
import EmailField from "./EmailField";
import PasswordSection from "./PasswordSection";
import SubmitButton from "./SubmitButton";

export default function ProfileForm() {
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(currentUser?.name || "");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { id: currentUser!.id };
    if (name !== currentUser?.name) payload.name = name;

    if (showPasswordFields) {
      const result = validatePasswords({
        current: passwordData.current,
        new: passwordData.new,
        confirm: passwordData.confirm,
      });

      if (!result.success) {
        setFormError(result.message || "Something went wrong");
        return;
      }

      payload.currentPassword = passwordData.current;
      payload.newPassword = passwordData.new;
      payload.confirmPassword = passwordData.confirm;
    }

    setFormError("");
    if (Object.keys(payload).length > 1) {
      dispatch(handleUpdateProfile(payload));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{formError}</div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700">{error}</div>
      )}

      <NameField value={name} onChange={setName} />
      <EmailField value={currentUser?.email || ""} />
      <PasswordSection
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        showPasswordFields={showPasswordFields}
        setShowPasswordFields={setShowPasswordFields}
      />
      <SubmitButton loading={loading} />
    </form>
  );
}
