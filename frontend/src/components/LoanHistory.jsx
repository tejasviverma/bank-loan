import { useEffect, useState } from "react";

export default function LoanHistory({ customerId, onClose }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/loans/${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return <div className="p-4">Loading loan history…</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">📄 Your Loan Applications</h2>
        <button onClick={onClose} className="text-sm text-blue-600">
          Back to Chat
        </button>
      </div>

      {loans.length === 0 && (
        <p className="text-gray-500">No loan applications found.</p>
      )}

      <div className="space-y-3">
        {loans.map((loan) => (
          <div
            key={loan._id}
            className="border rounded p-3 shadow-sm"
          >
            <div className="font-medium">
              Personal Loan — ₹{loan.requestedAmount.toLocaleString()}
            </div>

            <div className="text-sm text-gray-600">
              Status:{" "}
              {loan.status === "APPROVED" && "✅ Approved"}
              {loan.status === "REJECTED" && "❌ Rejected"}
              {loan.status === "SALARY_SLIP_REQUIRED" && "🧾 Salary Slip Required"}
            </div>

            {loan.emi && (
              <div className="text-sm">
                EMI: ₹{loan.emi.toLocaleString()}
              </div>
            )}

            <div className="text-xs text-gray-400">
              Applied on: {new Date(loan.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
