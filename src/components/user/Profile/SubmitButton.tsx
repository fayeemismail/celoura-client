// /components/user/Profile/SubmitButton.tsx
import { Save } from "lucide-react";
import COLORS from "../../../styles/theme";

export default function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{ backgroundColor: COLORS.accent, color: COLORS.cardBg }}
      className="flex w-full items-center justify-center rounded-lg py-3 font-medium transition-colors duration-300 hover:opacity-90"
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Saving...
        </span>
      ) : (
        <span className="flex items-center">
          Save Changes <Save className="ml-2 h-4 w-4" />
        </span>
      )}
    </button>
  );
}
