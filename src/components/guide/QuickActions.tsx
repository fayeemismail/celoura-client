import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 rounded-lg border border-gray-200 bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Quick Actions
      </h2>
      <div className="space-y-3">
        {quickActionButtons.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="w-full p-3 rounded-lg text-left bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;