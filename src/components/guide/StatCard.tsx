import { ReactNode } from 'react';
import { GUIDE_COLORS } from '../../styles/theme';

// Define the prop types for StatCard
interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  className?: string;
}

const StatCard = ({ 
  icon, 
  title, 
  value, 
  className = '' 
}: StatCardProps) => {
  return (
    <div 
      style={{ 
        backgroundColor: GUIDE_COLORS.inputBg,
        borderColor: GUIDE_COLORS.border
      }} 
      className={`p-5 rounded-lg border flex items-center space-x-4 ${className}`}
    >
      <div 
        style={{ 
          backgroundColor: GUIDE_COLORS.accent + '20', 
          color: GUIDE_COLORS.accent 
        }} 
        className="p-3 rounded-full"
      >
        {icon}
      </div>
      <div>
        <p 
          style={{ color: GUIDE_COLORS.secondaryText }} 
          className="text-sm mb-1"
        >
          {title}
        </p>
        <h3 
          style={{ color: GUIDE_COLORS.text }} 
          className="text-2xl font-bold"
        >
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;