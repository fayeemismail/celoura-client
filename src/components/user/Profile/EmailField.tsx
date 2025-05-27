import { Mail } from "lucide-react";
import COLORS from "../../../styles/theme";

export default function EmailField({ value }: { value: string }) {
  return (
    <div className="mb-4 relative">
      <Mail className="absolute left-3 top-3 h-5 w-5" style={{ color: COLORS.secondaryText }} />
      <input
        type="email"
        value={value}
        disabled
        style={{
          backgroundColor: COLORS.inputBg,
          borderColor: COLORS.border,
          color: COLORS.secondaryText,
          cursor: "not-allowed",
        }}
        className="w-full rounded-lg border p-3 pl-10"
      />
    </div>
  );
}
