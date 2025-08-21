import { useState } from "react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  processing?: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  processing = false,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#111] to-[#1c1c1c] border border-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Reason for Rejection</h3>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please provide a reason..."
          className="w-full h-32 px-4 py-2 rounded-xl bg-[#1a1f2e]/70 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || processing}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {processing ? "Processing..." : "Confirm Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
