import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TravelThemedCardProps {
  children: ReactNode;
  headerTitle: string;
  headerSubtitle: string;
}

export const TravelThemedCard = ({
  children,
  headerTitle,
  headerSubtitle,
}: TravelThemedCardProps) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
        <div className="absolute right-0 bottom-0 h-32 w-32 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-200 opacity-20 blur-xl"></div>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* Card header with travel theme */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-emerald-400 p-6 text-center">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden opacity-10">
            <div className="absolute left-10 top-5 h-16 w-16 rotate-45 rounded-md bg-white"></div>
            <div className="absolute right-10 bottom-5 h-10 w-10 rotate-12 rounded-full bg-white"></div>
            <div className="absolute right-20 top-10 h-8 w-8 rotate-45 rounded-md bg-white"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white drop-shadow-md">
              {headerTitle}
            </h1>
            <p className="mt-1 text-sm text-white/90">{headerSubtitle}</p>
          </motion.div>
        </div>

        {/* Card content */}
        <div className="p-8">{children}</div>
      </motion.div>
    </div>
  );
};