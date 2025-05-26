// components/common/ConfirmationDialog.tsx

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  color: string
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title = "Confirm Action",
  message,
  color,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: color,
              color: "white",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              fontWeight: 500,
            }}
          >
            Confirm
          </button>

        </div>
      </div>
    </div>
  );
}
