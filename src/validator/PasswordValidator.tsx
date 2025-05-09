import { z } from "zod";


const passwordRules = z.string()
  .min(6, "Password must be at least 6 characters.")
  .refine(
    (val) =>
      /[A-Z]/.test(val) &&        // at least one uppercase
      /[a-z]/.test(val) &&        // at least one lowercase
      /[0-9]/.test(val) &&        // at least one number
      /[^A-Za-z0-9]/.test(val),   // at least one special char
    {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }
  );


export const passwordSchema = z 
  .object({
    current: z.string().min(1, 'Current Password is required'),
    new: passwordRules,
    confirm: z.string().min(1, "Please confirm your Password.")
  })
  .refine((data) => data.new === data.confirm, {
    path: ['Confirm'],
    message: "New password and confirmation do not match"
  });


export function validatePasswords(passwords: {
  current: string;
  new: string;
  confirm: string;
}) {
  const result = passwordSchema.safeParse(passwords);
  if(!result.success){
    const firstError = result.error.errors[0];
    return {success: false, message: firstError.message}
  }
  return { success: true };
}