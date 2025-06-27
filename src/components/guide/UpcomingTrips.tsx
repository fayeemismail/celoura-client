const UpcomingTrips = () => {
  const trips = [
    { id: 1, destination: 'Bali, Indonesia', date: 'June 15-22, 2024', clients: 5 },
    { id: 2, destination: 'Tokyo, Japan', date: 'July 10-17, 2024', clients: 3 },
    { id: 3, destination: 'Paris, France', date: 'August 5-12, 2024', clients: 4 }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upcoming Trips
      </h2>
      <div className="space-y-3">
        {trips.map(trip => (
          <div 
            key={trip.id}
            className="p-4 rounded-lg border border-gray-200 bg-white flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium text-gray-800">
                {trip.destination}
              </h3>
              <p className="text-sm text-gray-500">
                {trip.date}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
              {trip.clients} Clients
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTrips;