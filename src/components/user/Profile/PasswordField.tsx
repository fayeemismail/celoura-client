// /components/user/Profile/PasswordField.tsx
import { Lock, Eye, EyeOff } from "lucide-react";
import COLORS from "../../../styles/theme";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  visible: boolean;
  toggle: () => void;
};

export default function PasswordField({ value, onChange, placeholder, visible, toggle }: Props) {
  return (
    <div className="mb-4 relative">
      <Lock className="absolute left-3 top-3 h-5 w-5" style={{ color: COLORS.secondaryText }} />
      <input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{ backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
        className="w-full rounded-lg border p-3 pl-10 pr-10 focus:outline-none focus:ring-2"
      />
      <div onClick={toggle} className="absolute right-3 top-3 cursor-pointer">
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>
    </div>
  );
}
