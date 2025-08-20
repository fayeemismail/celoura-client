import React from "react";

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  min?: string | number;
};

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  readOnly,
  min,
}: Props) {
  return (
    <div>
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label} {required && "*"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        min={min}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#9B8759]"
        } ${readOnly ? "bg-gray-100" : ""}`}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
