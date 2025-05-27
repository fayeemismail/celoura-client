import { User } from "lucide-react";
import COLORS from "../../../styles/theme";

export default function NameField({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="mb-4 relative">
      <User className="absolute left-3 top-3 h-5 w-5" style={{ color: COLORS.secondaryText }} />
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
        className="w-full rounded-lg border p-3 pl-10 focus:outline-none focus:ring-2"
      />
    </div>
  );
}
