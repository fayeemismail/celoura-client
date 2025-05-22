import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedInputProps {
  icon: LucideIcon;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const AnimatedInput = ({
  icon: Icon,
  type,
  name,
  value,
  placeholder,
  onChange,
  required = true,
}: AnimatedInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5"
    >
      <div className="relative">
        <Icon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          required={required}
        />
      </div>
    </motion.div>
  );
};