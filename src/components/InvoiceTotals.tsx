import React from 'react';

interface InvoiceTotalsProps {
  subtotal: number;
  discount: number;
  total: number;
}

export default function InvoiceTotals({ subtotal, discount, total }: InvoiceTotalsProps) {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Subtotal:</span>
        <span>₹{subtotal}</span>
      </div>
      {discount > 0 && <div className="flex justify-between mb-2">
        <span className="font-semibold">Discount:</span>
        <span>₹{discount}</span>
      </div>}
      <div className="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}