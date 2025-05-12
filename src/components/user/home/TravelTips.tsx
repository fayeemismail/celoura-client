import COLORS from "../../../styles/theme";


export default function TravelTips() {
  return (
    <section className="mb-12">
      <h2 style={{ color: COLORS.text }} className="text-2xl font-semibold mb-6">Travel Tips & Inspiration</h2>
      <div style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }} className="border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 style={{ color: COLORS.accent }} className="text-lg font-semibold mb-3">Essential Travel Tips</h3>
            <ul style={{ color: COLORS.secondaryText }} className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Research local customs and etiquette before your trip</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Pack versatile clothing suitable for different weather conditions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keep digital and physical copies of important documents</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Learn basic phrases in the local language</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: COLORS.accent }} className="text-lg font-semibold mb-3">Seasonal Recommendations</h3>
            <ul style={{ color: COLORS.secondaryText }} className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Spring: Cherry blossoms in Japan, tulip fields in Netherlands</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Summer: Coastal escapes in Mediterranean, midnight sun in Scandinavia</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fall: New England foliage, wine harvests in Tuscany</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Winter: Northern Lights in Iceland, Christmas markets in Germany</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}