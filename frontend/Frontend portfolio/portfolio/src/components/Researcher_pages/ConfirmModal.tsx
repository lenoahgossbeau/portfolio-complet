import React, { useEffect, useRef } from "react";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-80 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          Delete researcher?
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
