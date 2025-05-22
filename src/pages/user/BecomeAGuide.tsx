import { Formik, Form, Field, ErrorMessage } from "formik";
import { guideApplicationSchema } from "../../validator/GuideApplicationSchema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import COLORS from "../../styles/theme";
import Navbar from "../../components/user/home/Navbar";
import { applyForGuide } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const experienceOptions = ["0-1 years", "1-2 years", "2-3 years", "3+ years"];
const expertiseOptions = ["Historical Tours", "Adventure", "Food Tours", "Nature"];

export default function BecomeAGuide() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const initialValues = {
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    expertise: "",
    idFile: null,
    userId: currentUser?.id,
  };

  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("dob", values.dob);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("experience", values.experience);
      formData.append("expertise", values.expertise);
      formData.append("userId", values.userId);
      if (values.idFile) {
        formData.append("idFile", values.idFile);
      }

      await applyForGuide(formData);

      toast.success("Application submitted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12" style={{ backgroundColor: COLORS.bg }}>
      <div className="container mx-auto px-4">
        <Navbar />
        <div
          style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
          className="border rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto"
        >
          <div style={{ backgroundColor: COLORS.accent }} className="p-6 text-white">
            <h1 className="text-2xl font-bold">Guide Application</h1>
            <p className="opacity-90 mt-1">Join our community of local experts</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={guideApplicationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                      Full Name *
                    </label>
                    <Field
                      name="fullName"
                      className="w-full p-3 border rounded-lg"
                      style={{ borderColor: COLORS.border }}
                    />
                    <ErrorMessage name="fullName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                      Date of Birth *
                    </label>
                    <Field
                      type="date"
                      name="dob"
                      className="w-full p-3 border rounded-lg"
                      style={{ borderColor: COLORS.border }}
                    />
                    <ErrorMessage name="dob" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                      Phone Number *
                    </label>
                    <PhoneInput
                      country="in"
                      value={values.phone}
                      onChange={(value) => setFieldValue("phone", value)}
                      inputStyle={{
                        width: "100%",
                        padding: "0.75rem",
                        borderColor: COLORS.border,
                        borderRadius: "0.5rem",
                      }}
                      buttonStyle={{
                        borderColor: COLORS.border,
                        borderRadius: "0.5rem 0 0 0.5rem",
                      }}
                      dropdownStyle={{
                        borderColor: COLORS.border,
                      }}
                      enableSearch
                    />
                    {touched.phone && errors.phone && (
                      <div className="text-red-600 text-sm mt-1">{errors.phone}</div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                      Email *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full p-3 border rounded-lg"
                      style={{ borderColor: COLORS.border }}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                    Address *
                  </label>
                  <Field
                    as="textarea"
                    name="address"
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    rows={3}
                    placeholder="Enter your full address"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                    ID Verification *
                  </label>
                  <div className="border rounded-lg p-4" style={{ borderColor: COLORS.border }}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(event) =>
                        setFieldValue("idFile", event.currentTarget.files?.[0] || null)
                      }
                      className="w-full"
                    />
                    <p className="text-sm mt-2" style={{ color: COLORS.secondaryText }}>
                      Upload a government-issued ID (PDF, JPG, or PNG)
                    </p>
                    {touched.idFile && errors.idFile && (
                      <div className="text-red-600 text-sm mt-1">{errors.idFile}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                    Guiding Experience *
                  </label>
                  <Field
                    as="select"
                    name="experience"
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                  >
                    <option value="">Select experience range</option>
                    {experienceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="experience" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                    Areas of Expertise *
                  </label>
                  <Field
                    as="select"
                    name="expertise"
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                  >
                    <option value="">Select expertise</option>
                    {expertiseOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="expertise" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: COLORS.accent }}
                    className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
