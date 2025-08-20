// components/user/Destination/DestinationSelector.tsx
import { Guide } from "../../../types/IGuideOnDestination";

type DestinationSelectorProps = {
  guide: Guide;
  selectedDestinations: string[];
  onSelect: (destinationName: string) => void;
  error?: string;
};

export default function DestinationSelector({
  guide,
  selectedDestinations,
  onSelect,
  error,
}: DestinationSelectorProps) {
  return (
    <div className="p-6 border-b">
      <h2 className="text-xl font-semibold mb-4">Select Destinations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {guide.availableDestinations.map((destination) => {
          const isSelected = selectedDestinations.includes(destination);
          return (
            <button
              key={destination}
              type="button"
              className={`px-4 py-2 rounded-lg border transition ${
                isSelected
                  ? "bg-[#9B8759] text-white border-[#9B8759]"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
              }`}
              onClick={() => onSelect(destination)}
            >
              {destination}
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
