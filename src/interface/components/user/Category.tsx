import COLORS from "../../styles/theme";

// Categories data
const categories = [
    { id: 1, name: "Beaches", icon: "🏖️" },
    { id: 2, name: "Mountains", icon: "🏔️" },
    { id: 3, name: "Cities", icon: "🏙️" },
    { id: 4, name: "Historical", icon: "🏛️" },
    { id: 5, name: "Adventure", icon: "🧗‍♀️" },
    { id: 6, name: "Food Tours", icon: "🍽️" }
  ];
  
  export default function CategoriesSection() {
    return (
      <section className="mb-12">
        <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}
              className="border rounded-lg p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 style={{ color: COLORS.text }} className="font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  }