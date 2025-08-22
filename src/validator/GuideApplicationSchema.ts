import * as Yup from "yup";
import { differenceInYears } from "date-fns";

export const guideApplicationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(25, 'Name cannot exceed 25 characters')
    .required('Full name is required'),
  dob: Yup.date()
    .required("Date of birth is required")
    .test("is-18", "You must be at least 18 years old", function (value) {
      if (!value) return false;
      return differenceInYears(new Date(), new Date(value)) >= 18;
    })
    .test("is-60", "Age cannot be more than 60 years", function (value) {
      if (!value) return false;
      return differenceInYears(new Date(), new Date(value)) <= 60;
    }),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  experience: Yup.string().required("Experience is required"),
  expertise: Yup.string().required("Expertise is required"),
  idFile: Yup.mixed().required("ID verification file is required"),
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
  basedOn: Yup.string()
    .min(3, 'Destination must be at least 3 characters')
    .max(45, 'Destination cannot exceed 45 characters')
    .required('Destination is required'),
});
