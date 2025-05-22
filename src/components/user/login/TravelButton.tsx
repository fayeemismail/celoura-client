import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TravelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export const TravelButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: TravelButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 py-3.5 font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 disabled:opacity-70 ${className}`}
    >
      {children}
    </motion.button>
  );
};