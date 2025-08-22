import { useState } from "react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (budget: number) => void;
  processing?: boolean;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  processing = false,
}) => {
  const [budget, setBudget] = useState<string>("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const value = Number(budget);
    if (value >= 1000 && value <= 60000) {
      onConfirm(value);
    }
  };

  const isValid = budget !== "" && Number(budget) >= 1000 && Number(budget) <= 60000;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Enter Budget</h3>

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Enter budget between 1,000 and 60,000"
          className="w-full px-4 py-2 rounded-xl bg-[#1a1f2e]/70 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition mb-4"
        />
        {!isValid && budget !== "" && (
          <p className="text-red-400 text-sm mb-2">
            Budget must be between 1,000 and 60,000
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || processing}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {processing ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
