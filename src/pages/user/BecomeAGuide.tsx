import { Formik, Form, Field, ErrorMessage } from "formik";
import { guideApplicationSchema } from "../../validator/GuideApplicationSchema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import COLORS from "../../styles/theme";
import Navbar from "../../components/user/home/Navbar";
import { applyForGuide } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { hasRegisteredThunk } from "../../redux/user/userThunks";

type GuideApplicationFormValues = {
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  expertise: string;
  idFile: File | null;
  userId: string;
  basedOn: string;
};

type GuideApplicationData = {
  _id: string;
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  experience: string;
  expertise: string;
  basedOn: string;
  idFileUrl: string;
  rejectReason?: string;
  status: "pending" | "approved" | "rejected";
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const experienceOptions = ["0-1 years", "1-2 years", "2-3 years", "3+ years"];
const expertiseOptions = ["Historical Tours", "Adventure", "Food Tours", "Nature"];

export default function BecomeAGuide() {
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [previousApplication, setPreviousApplication] = useState<GuideApplicationData | null>(null);
  const [canReapply, setCanReapply] = useState(false);

  const initialValues: GuideApplicationFormValues = {
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    expertise: "",
    idFile: null,
    userId: currentUser?.id || "",
    basedOn: "",
  };

  const hasRegistered = async () => {
    try {
      const response = await dispatch(hasRegisteredThunk(currentUser?.id!));
      setPreviousApplication(response);
      
      if (response?.createdAt) {
        const applicationDate = new Date(response.createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        setCanReapply(applicationDate < oneWeekAgo);
      }
    } catch (error) {
      toast.error("An error occurred while checking registration.");
    }
  };

  const handleSubmit = async (
    values: GuideApplicationFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
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
      formData.append("basedOn", values.basedOn);
      if (values.idFile) {
        formData.append("idFile", values.idFile);
      }

      await applyForGuide(formData);
      toast.success("Application submitted successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response?.data?.message === "string"
      ) {
        toast.error((error as any).response.data.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      hasRegistered();
    }
  }, [isAuthenticated, navigate]);

  if (previousApplication) {
    if (previousApplication.status === "rejected" && previousApplication.rejectReason) {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center px-4"
          style={{ backgroundColor: COLORS.bg }}
        >
          <Navbar />
          <div
            className="bg-white rounded-xl shadow-md p-6 max-w-xl text-center border"
            style={{ borderColor: COLORS.border }}
          >
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Application Rejected</h2>
            <p className="text-gray-800 mb-6">{previousApplication.rejectReason}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setPreviousApplication(null)}
                style={{ backgroundColor: COLORS.accent }}
                className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
              >
                Re-Apply
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (previousApplication.status === "pending") {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center px-4"
          style={{ backgroundColor: COLORS.bg }}
        >
          <Navbar />
          <div
            className="bg-white rounded-xl shadow-md p-6 max-w-xl text-center border"
            style={{ borderColor: COLORS.border }}
          >
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Application Pending</h2>
            <p className="text-gray-800 mb-6">
              Your application is currently under review. Please wait for our team to process it.
            </p>

            {canReapply ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setPreviousApplication(null)}
                  style={{ backgroundColor: COLORS.accent }}
                  className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90"
                >
                  Re-Apply
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Go Home
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100"
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              >
                Go Home
              </button>
            )}
          </div>
        </div>
      );
    }

    if (previousApplication.status === "approved") {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center px-4"
          style={{ backgroundColor: COLORS.bg }}
        >
          <Navbar />
          <div
            className="bg-white rounded-xl shadow-md p-6 max-w-xl text-center border"
            style={{ borderColor: COLORS.border }}
          >
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Application Approved</h2>
            <p className="text-gray-800 mb-6">
              Congratulations! Your guide application has been approved.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100"
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
  }

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
                    <div className="relative">
                      <div className="border rounded-lg" style={{ borderColor: COLORS.border }}>
                        <PhoneInput
                          country="in"
                          value={values.phone}
                          onChange={(value) => setFieldValue("phone", value)}
                          inputStyle={{
                            width: "100%",
                            padding: "0.75rem 0.75rem 0.75rem 60px",
                            border: "none",
                            borderRadius: "0.5rem",
                            backgroundColor: "transparent",
                          }}
                          buttonStyle={{
                            border: "none",
                            backgroundColor: "transparent",
                            padding: "0 10px 0 15px",
                          }}
                          dropdownStyle={{
                            borderColor: COLORS.border,
                          }}
                          containerStyle={{
                            padding: "0",
                          }}
                          enableSearch
                        />
                      </div>
                    </div>
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

                <div>
                  <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
                    Based On *
                  </label>
                  <Field
                    type="text"
                    name="basedOn"
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                  />
                  <ErrorMessage name="basedOn" component="div" className="text-red-600 text-sm mt-1" />
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