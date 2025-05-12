import { useNavigate } from 'react-router-dom';
import { GUIDE_COLORS } from '../../styles/theme';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActionButtons = [
    {
      label: 'Create New Trip',
      onClick: () => navigate('/guide/trips/create')
    },
    {
      label: 'View Client List',
      onClick: () => navigate('/guide/clients')
    },
    {
      label: 'Report an Issue',
      onClick: () => navigate('/guide/support')
    }
  ];

  return (
    <div 
      style={{ 
        backgroundColor: GUIDE_COLORS.inputBg,
        borderColor: GUIDE_COLORS.border
      }} 
      className="p-6 rounded-lg border"
    >
      <h2 
        style={{ color: GUIDE_COLORS.text }} 
        className="text-xl font-semibold mb-4"
      >
        Quick Actions
      </h2>
      <div className="space-y-3">
        {quickActionButtons.map((action, index) => (
          <button 
            key={index}
            onClick={action.onClick}
            style={{ 
              backgroundColor: GUIDE_COLORS.accent + '20', 
              color: GUIDE_COLORS.accent 
            }} 
            className="w-full p-3 rounded-lg text-left hover:bg-opacity-30 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;