export const validateName = (name: string) => name.length >= 3 && name.length <= 45;
export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone: string) => phone.length === 10 && /^\d+$/.test(phone);
export const validateAddress = (address: string) => address.length >= 10;
export const validateBudget = (budget: number) => budget >= 1000;

export const validateDates = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return { valid: false, error: "Both dates are required" };

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) return { valid: false, error: "End date must be after start date" };

  return { valid: true, error: "" };
};
