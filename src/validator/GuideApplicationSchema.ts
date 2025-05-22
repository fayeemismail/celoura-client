import * as Yup from "yup";
import { differenceInYears } from "date-fns"; 

export const guideApplicationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .test("is-18", "You must be at least 18 years old", function (value) {
      if (!value) return false;
      return differenceInYears(new Date(), new Date(value)) >= 18;
    }),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  experience: Yup.string().required("Experience is required"),
  expertise: Yup.string().required("Expertise is required"),
  idFile: Yup.mixed().required("ID verification file is required"),
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"), 
});
