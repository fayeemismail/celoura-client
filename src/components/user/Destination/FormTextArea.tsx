import React from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export default function FormTextArea({ label, name, value, onChange, placeholder }: Props) {
  return (
    <div>
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B8759]"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}
