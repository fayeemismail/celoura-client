export interface ValidationErrors {
  name: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ValidateProfileOptions {
  name: string;
  bio: string;
  changePassword: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function validateGuideProfile({
  name,
  bio,
  changePassword,
  currentPassword,
  newPassword,
  confirmPassword,
}: ValidateProfileOptions): { valid: boolean; errors: ValidationErrors } {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

  const trimmedName = name.trim();
  const trimmedBio = bio.trim();

  let valid = true;

  const errors: ValidationErrors = {
    name: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!trimmedName) {
    errors.name = "Name is required";
    valid = false;
  }

  if (bio.length > 0 && !trimmedBio) {
    errors.bio = "Bio cannot be just spaces";
    valid = false;
  }

  if (changePassword) {
    if (!currentPassword.trim()) {
      errors.currentPassword = "Current password required";
      valid = false;
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password required";
      valid = false;
    } else if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      errors.newPassword =
        "Must include upper, lower, number & special char";
      valid = false;
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password required";
      valid = false;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      currentPassword === newPassword &&
      newPassword === confirmPassword
    ) {
      errors.confirmPassword = "All passwords are the same";
      valid = false;
    }
  }

  return { valid, errors };
}
