import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  className?: string;
  iconColor?: string; // Tailwind color class for the icon
  iconBgColor?: string; // Tailwind color class for icon background
}

const StatCard = ({ 
  icon, 
  title, 
  value, 
  className = '',
  iconColor = 'text-blue-500', // Default blue icon
  iconBgColor = 'bg-blue-100' // Default light blue background
}: StatCardProps) => {
  return (
    <div className={`p-5 rounded-lg border border-gray-200 bg-[#2d2d2db5] flex items-center space-x-4 ${className}`}>
      <div className={`p-3 rounded-full ${iconBgColor} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm mb-1 text-[#fff]">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-[#fff]">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;