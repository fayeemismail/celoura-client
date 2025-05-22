import { motion } from "framer-motion";

interface FadeInContainerProps {
  children: React.ReactNode;
  delay?: number;
}

export const FadeInContainer = ({ children, delay = 0 }: FadeInContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};