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
import { useEffect, useState, useCallback } from "react";
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
  profilePhoto: File | null;
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
  profilePhotoUrl: string;
  rejectReason?: string;
  status: "pending" | "approved" | "rejected";
  userId: string;
  createdAt: string;
  updatedAt: string;
};

const experienceOptions = ["0-1 years", "1-2 years", "2-3 years", "3+ years"];
const expertiseOptions = [
  "Historical Tours",
  "Adventure",
  "Food Tours",
  "Nature",
  "City",
];

// Drag and drop component
const FileDropArea = ({ 
  fieldName, 
  label, 
  accept, 
  file, 
  setFieldValue, 
  error, 
  touched 
}: { 
  fieldName: string;
  label: string;
  accept: string;
  file: File | null;
  setFieldValue: (field: string, value: any) => void;
  error: string | undefined;
  touched: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFieldValue(fieldName, droppedFile);
    }
  }, [fieldName, setFieldValue]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div>
      <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById(fieldName)?.click()}
      >
        <input
          id={fieldName}
          type="file"
          accept={accept}
          onChange={(e) => setFieldValue(fieldName, e.currentTarget.files?.[0] || null)}
          className="hidden"
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium" style={{ color: COLORS.text }}>
              {file.name}
            </p>
            <p className="text-sm mt-1" style={{ color: COLORS.secondaryText }}>
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="font-medium" style={{ color: COLORS.text }}>
              Click to upload or drag and drop
            </p>
            <p className="text-sm mt-1" style={{ color: COLORS.secondaryText }}>
              {accept.includes("image") ? "JPG, PNG, PDF up to 10MB" : "PDF, JPG, PNG up to 10MB"}
            </p>
          </div>
        )}
      </div>
      {touched && error && (
        <div className="text-red-600 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

// Form field component to reduce repetition
const FormField = ({ 
  name, 
  label, 
  type = "text", 
  as = "input", 
  options, 
  component, 
  gridCols = 1 
}: { 
  name: string; 
  label: string; 
  type?: string; 
  as?: string; 
  options?: string[]; 
  component?: React.ElementType;
  gridCols?: number;
}) => (
  <div className={gridCols > 1 ? `col-span-${gridCols}` : ""}>
    <label className="block mb-2 font-medium" style={{ color: COLORS.text }}>
      {label}
    </label>
    {component ? (
      <Field name={name} as={component} className="w-full p-3 border rounded-lg" style={{ borderColor: COLORS.border }} />
    ) : as === "select" ? (
      <Field as="select" name={name} className="w-full p-3 border rounded-lg" style={{ borderColor: COLORS.border }}>
        <option value="">Select {label.toLowerCase()}</option>
        {options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </Field>
    ) : (
      <Field 
        type={type} 
        name={name} 
        as={as} 
        className="w-full p-3 border rounded-lg" 
        style={{ borderColor: COLORS.border }}
        {...(as === "textarea" ? { rows: 3 } : {})}
      />
    )}
    <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-1" />
  </div>
);

export default function BecomeAGuide() {
  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [previousApplication, setPreviousApplication] =
    useState<GuideApplicationData | null>(null);
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
    profilePhoto: null,
    userId: currentUser?.id || "",
    basedOn: "",
  };

  const hasRegistered = async () => {
    try {
      const response = await dispatch(hasRegisteredThunk(currentUser?.id!));
      setPreviousApplication(response as any);

      if ((response as any)?.createdAt) {
        const applicationDate = new Date((response as any).createdAt);
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
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

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

  // Show Pending/Approved status
  if (previousApplication && previousApplication.status === "pending") {
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
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Application Pending
          </h2>
          <p className="text-gray-800 mb-6">
            Your application is currently under review. Please wait for our
            team to process it.
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

  return (
    <div
      className="min-h-screen pt-28 pb-12"
      style={{ backgroundColor: COLORS.bg }}
    >
      <div className="container mx-auto px-4">
        <Navbar />
        <div
          style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
          className="border rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto"
        >
          <div
            style={{ backgroundColor: COLORS.accent }}
            className="p-6 text-white"
          >
            <h1 className="text-2xl font-bold">Guide Application</h1>
            <p className="opacity-90 mt-1">
              Join our community of local experts
            </p>
          </div>

          <Formik
            initialValues={
              previousApplication?.status === "rejected"
                ? {
                    fullName: previousApplication.fullName || "",
                    dob: previousApplication.dob
                      ? new Date(previousApplication.dob)
                          .toISOString()
                          .split("T")[0]
                      : "",
                    phone: previousApplication.phone || "",
                    email: previousApplication.email || "",
                    address: previousApplication.address || "",
                    experience: previousApplication.experience || "",
                    expertise: previousApplication.expertise || "",
                    basedOn: previousApplication.basedOn || "",
                    idFile: null,
                    profilePhoto: null,
                    userId: currentUser?.id || "",
                  }
                : initialValues
            }
            enableReinitialize
            validationSchema={guideApplicationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="p-6 space-y-6">
                {previousApplication?.status === "rejected" &&
                  previousApplication.rejectReason && (
                    <div className="p-4 border border-red-400 bg-red-50 text-red-700 rounded-lg">
                      <strong>Reason for Rejection: </strong>
                      {previousApplication.rejectReason}
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField name="fullName" label="Full Name *" gridCols={1} />
                  <FormField name="dob" label="Date of Birth *" type="date" gridCols={1} />
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
                  <FormField name="email" label="Email *" type="email" gridCols={1} />
                </div>

                <FormField name="address" label="Address *" as="textarea" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileDropArea
                    fieldName="idFile"
                    label="ID Verification *"
                    accept="image/*,.pdf"
                    file={values.idFile}
                    setFieldValue={setFieldValue}
                    error={errors.idFile as string}
                    touched={touched.idFile as boolean}
                  />
                  <FileDropArea
                    fieldName="profilePhoto"
                    label="Profile Photo *"
                    accept="image/*"
                    file={values.profilePhoto}
                    setFieldValue={setFieldValue}
                    error={errors.profilePhoto as string}
                    touched={touched.profilePhoto as boolean}
                  />
                </div>

                <FormField 
                  name="experience" 
                  label="Guiding Experience *" 
                  as="select" 
                  options={experienceOptions} 
                />
                
                <FormField 
                  name="expertise" 
                  label="Areas of Expertise *" 
                  as="select" 
                  options={expertiseOptions} 
                />

                <FormField name="basedOn" label="Based On *" />

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