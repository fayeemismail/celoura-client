// FollowButton.tsx
import { motion } from "framer-motion";
import { UserPlus, Check } from "lucide-react";

interface FollowButtonProps {
  isFollowing: boolean;
  onToggleFollow: () => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing,
  onToggleFollow,
}) => {
  return (
    <motion.button
      onClick={onToggleFollow}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      initial={false}
      animate={{ backgroundColor: isFollowing ? "#1F2937" : "#10B981" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`px-6 py-2 text-white font-semibold rounded-full flex items-center gap-2 shadow-md transition duration-200`}
    >
      <motion.div
        key={isFollowing ? "following" : "follow"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {isFollowing ? (
          <Check className="w-5 h-5" />
        ) : (
          <UserPlus className="w-5 h-5" />
        )}
      </motion.div>

      <motion.span
        key={isFollowing ? "Following" : "Follow"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {isFollowing ? "Following" : "Follow"}
      </motion.span>
    </motion.button>
  );
};
