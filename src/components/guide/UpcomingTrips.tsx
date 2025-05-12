import { GUIDE_COLORS } from '../../styles/theme';

const UpcomingTrips = () => {
  const trips = [
    { id: 1, destination: 'Bali, Indonesia', date: 'June 15-22, 2024', clients: 5 },
    { id: 2, destination: 'Tokyo, Japan', date: 'July 10-17, 2024', clients: 3 },
    { id: 3, destination: 'Paris, France', date: 'August 5-12, 2024', clients: 4 }
  ];

  return (
    <div>
      <h2 
        style={{ color: GUIDE_COLORS.text }} 
        className="text-xl font-semibold mb-4"
      >
        Upcoming Trips
      </h2>
      <div className="space-y-3">
        {trips.map(trip => (
          <div 
            key={trip.id}
            style={{ 
              backgroundColor: GUIDE_COLORS.inputBg,
              borderColor: GUIDE_COLORS.border
            }} 
            className="p-4 rounded-lg border flex justify-between items-center"
          >
            <div>
              <h3 
                style={{ color: GUIDE_COLORS.text }} 
                className="font-medium"
              >
                {trip.destination}
              </h3>
              <p 
                style={{ color: GUIDE_COLORS.secondaryText }} 
                className="text-sm"
              >
                {trip.date}
              </p>
            </div>
            <span 
              style={{ 
                backgroundColor: GUIDE_COLORS.accent + '20', 
                color: GUIDE_COLORS.accent 
              }} 
              className="px-3 py-1 rounded-full text-sm"
            >
              {trip.clients} Clients
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTrips;