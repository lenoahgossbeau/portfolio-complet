type FilePickerProps = {
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  file: File | null;
  accept: string;
  helperText?: string;
  chooseLabel: string;
  onChange: (file: File | null) => void;
};

export default function FilePicker({
  label,
  inputRef,
  file,
  accept,
  helperText,
  chooseLabel,
  onChange,
}: FilePickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <input
        type="file"
        ref={inputRef}
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
      >
        {chooseLabel}
      </button>

      {file && (
        <span className="ml-2 text-sm text-gray-600">
          {file.name}
        </span>
      )}

      {helperText && (
        <p className="text-xs text-gray-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}