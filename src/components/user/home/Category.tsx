import {
  Mountain,
  Landmark,
  Building2,
  Utensils,
  PlaneTakeoff,
  Waves
} from "lucide-react";
import COLORS from "../../../styles/theme";

const categories = [
  { id: 1, name: "Beaches", icon: <Waves className="w-8 h-8 text-blue-500" /> },
  { id: 2, name: "Mountains", icon: <Mountain className="w-8 h-8 text-green-600" /> },
  { id: 3, name: "Cities", icon: <Building2 className="w-8 h-8 text-gray-700" /> },
  { id: 4, name: "Historical", icon: <Landmark className="w-8 h-8 text-yellow-600" /> },
  { id: 5, name: "Adventure", icon: <PlaneTakeoff className="w-8 h-8 text-red-500" /> },
  { id: 6, name: "Food Tours", icon: <Utensils className="w-8 h-8 text-orange-500" /> }
];

export default function CategoriesSection() {
  return (
    <section className="mb-12">
      <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-6">
        Explore by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              backgroundColor: COLORS.cardBg,
              borderColor: COLORS.border
            }}
            className="border rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow group"
          >
            <div className="mb-2 flex justify-center transition-transform duration-300 group-hover:scale-110">
              {category.icon}
            </div>
            <h3 style={{ color: COLORS.text }} className="font-medium">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
