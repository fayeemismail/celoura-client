import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="max-w-md w-full"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 5, 0],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-4">
              404
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Oops! The page you're looking for got lost in space.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={() => navigate(-1)} // Go back to previous page
              className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full shadow-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full group-hover:translate-x-0 ease">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                Go Back
              </span>
              <span className="relative invisible">Go Back</span>
            </button>
          </motion.div>
          
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-400 text-sm">
              Or try searching for what you need
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}