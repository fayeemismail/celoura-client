import { UserCheck, MapPin, Calendar } from "lucide-react";
import AdminStats from "../AdminStats";

interface Props {
  users?: any[];
  guide?: any[];
}

export default function AdminDashboardContent({ users, guide }: Props) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AdminStats 
          icon={<UserCheck className="h-6 w-6" />}
          title="Active Guides"
          value={guide?.length?.toString() || "0"}
          trend="+2.5%"
          trendUp
        />
        <AdminStats 
          icon={<UserCheck className="h-6 w-6" />}
          title="Active Users"
          value={users?.length?.toString() || "0"}
          trend="+8.1%"
          trendUp
        />
        <AdminStats 
          icon={<MapPin className="h-6 w-6" />}
          title="Destinations"
          value="126"
          trend="+3"
          trendUp
        />
        <AdminStats 
          icon={<Calendar className="h-6 w-6" />}
          title="This Month"
          value="$48,289"
          trend="+14.3%"
          trendUp
        />
      </div>
    </div>
  );
}
