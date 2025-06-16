// components/common/ImageUploader.tsx
import { useRef } from "react";
import { toast } from "react-toastify";

interface Props {
  index: number;
  file: File | null;
  onChange: (file: File, index: number) => void;
}

export default function ImageUploader({ index, file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image size must be under 5MB");
    onChange(file, index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="w-48 h-48 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-[#1A1F2C] text-center text-gray-400 cursor-pointer relative"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {file ? (
        <img
          src={URL.createObjectURL(file)}
          alt={`Preview ${index + 1}`}
          className="absolute inset-0 object-cover w-full h-full rounded-lg"
        />
      ) : (
        <p className="text-sm px-2">Click or drop Image {index + 1}</p>
      )}
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
