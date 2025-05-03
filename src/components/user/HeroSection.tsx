import { useState } from "react";
import { Search } from "lucide-react";
import COLORS from "../../styles/theme";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="mb-12 mt-6">
      <div style={{ backgroundColor: COLORS.accent }} className="rounded-xl overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:p-12 md:w-1/2">
            <h1 style={{ color: COLORS.cardBg }} className="text-3xl md:text-4xl font-bold mb-4">
              Discover Your Next Adventure
            </h1>
            <p style={{ color: COLORS.inputBg }} className="mb-6 text-lg">
              Explore stunning destinations and create unforgettable memories with our curated travel guides.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
              />
            </form>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/api/placeholder/600/400" 
              alt="Travel destination" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}