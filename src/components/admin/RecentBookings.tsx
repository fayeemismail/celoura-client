import { ADMIN_COLORS } from "../../styles/theme";
import { MoreHorizontal, Check, X, AlertCircle } from "lucide-react";

// Mock data for recent bookings
const bookings = [
  {
    id: "BK-3901",
    customer: "Sarah Johnson",
    destination: "Bali, Indonesia",
    date: "May 12, 2025",
    amount: "$1,249",
    status: "confirmed"
  },
  {
    id: "BK-3902",
    customer: "Michael Chen",
    destination: "Santorini, Greece",
    date: "May 15, 2025",
    amount: "$1,878",
    status: "pending"
  },
  {
    id: "BK-3903",
    customer: "Emma Davis",
    destination: "Tokyo, Japan",
    date: "May 18, 2025",
    amount: "$2,130",
    status: "confirmed"
  },
  {
    id: "BK-3904",
    customer: "Robert Wilson",
    destination: "Paris, France",
    date: "May 20, 2025",
    amount: "$1,560",
    status: "cancelled"
  },
  {
    id: "BK-3905",
    customer: "Olivia Martinez",
    destination: "Bangkok, Thailand",
    date: "May 25, 2025",
    amount: "$990",
    status: "confirmed"
  }
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let bgColor, textColor, icon;

  switch (status) {
    case "confirmed":
      bgColor = "bg-green-100";
      textColor = "text-green-600";
      icon = <Check className="mr-1 h-3 w-3" />;
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-600";
      icon = <AlertCircle className="mr-1 h-3 w-3" />;
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-600";
      icon = <X className="mr-1 h-3 w-3" />;
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      icon = <AlertCircle className="mr-1 h-3 w-3" />;
  }

  return (
    <span className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function RecentBookings() {
  return (
    <div 
      style={{ backgroundColor: ADMIN_COLORS.cardBg, borderColor: ADMIN_COLORS.border }} 
      className="rounded-lg border shadow-sm"
    >
      <div 
        style={{ borderColor: ADMIN_COLORS.border }} 
        className="flex items-center justify-between border-b p-6"
      >
        <h2 style={{ color: ADMIN_COLORS.text }} className="text-lg font-semibold">
          Recent Bookings
        </h2>
        <button 
          style={{ color: ADMIN_COLORS.accent }} 
          className="text-sm font-medium"
        >
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: ADMIN_COLORS.hoverBg }}>
            <tr>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Booking ID
              </th>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Customer
              </th>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Destination
              </th>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Date
              </th>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Amount
              </th>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Status
              </th>
              <th 
                style={{ color: ADMIN_COLORS.secondaryText }} 
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody 
            style={{ color: ADMIN_COLORS.text }} 
            className="divide-y"
          >
            {bookings.map((booking) => (
              <tr 
                key={booking.id}
                style={{ borderColor: ADMIN_COLORS.border }}
                className="transition-colors hover:bg-gray-50"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = ADMIN_COLORS.hoverBg}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <span style={{ color: ADMIN_COLORS.accent }} className="font-medium">
                    {booking.id}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {booking.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {booking.destination}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {booking.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {booking.amount}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button 
                    style={{ color: ADMIN_COLORS.secondaryText }} 
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}