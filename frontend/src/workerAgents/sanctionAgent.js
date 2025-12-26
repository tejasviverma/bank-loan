import jsPDF from "jspdf";

export const generateSanctionLetter = ({
  customer,
  loanAmount,
  emi,
  creditScore,
}) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("TATA CAPITAL", 20, 20);

  doc.setFontSize(14);
  doc.text("Personal Loan Sanction Letter", 20, 35);

  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);

  doc.text(`Customer Name: ${customer.name}`, 20, 65);
  doc.text(`City: ${customer.city}`, 20, 75);
  doc.text(`Credit Score: ${creditScore}`, 20, 85);

  doc.text(`Approved Loan Amount: ₹${loanAmount.toLocaleString()}`, 20, 100);
  doc.text(`Tenure: 12 months`, 20, 110);
  doc.text(`Interest Rate: 12% p.a.`, 20, 120);
  doc.text(`Estimated EMI: ₹${emi}`, 20, 130);

  doc.text(
    "This is a system-generated sanction letter. No signature is required.",
    20,
    155
  );

  doc.text("Thank you for choosing Tata Capital.", 20, 170);

  doc.save(`Sanction_Letter_${customer.name.replace(/\s/g, "_")}.pdf`);
};
