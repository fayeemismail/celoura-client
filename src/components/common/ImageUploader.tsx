import { useRef, useMemo } from "react";
import { toast } from "react-toastify";

interface Props {
  index: number;
  file: File | string | null;
  onChange: (file: File, index: number) => void;
}

export default function ImageUploader({ index, file, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }
    onChange(file, index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const previewUrl = useMemo(() => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    } else if (typeof file === "string") {
      return file;
    }
    return null;
  }, [file]);

  return (
    <div
      className="w-48 h-48 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-[#1A1F2C] text-center text-gray-400 cursor-pointer relative overflow-hidden"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`Preview ${index + 1}`}
          className="absolute inset-0 object-cover w-full h-full rounded-lg"
        />
      ) : (
        <p className="text-sm px-2 z-10">Click or drop Image {index + 1}</p>
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
