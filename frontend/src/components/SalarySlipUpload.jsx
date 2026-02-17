import { useState } from "react";

export default function SalarySlipUpload({ loanId, onDone }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    await fetch("/api/upload-salary-slip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanId,
        fileName: file.name,
      }),
    });

    setLoading(false);
    onDone();
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg mb-3">
        🧾 Upload Salary Slip
      </h2>

      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        disabled={loading}
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
