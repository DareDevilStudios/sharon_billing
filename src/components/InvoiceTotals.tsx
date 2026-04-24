import { amountInWords } from '../utils/numberToWords';

interface InvoiceTotalsProps {
  subtotal: number;
  discount: number;
  total: number;
}

export default function InvoiceTotals({ subtotal, discount, total }: InvoiceTotalsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 items-start">
      <div className="border border-black p-3 text-sm">
        <div className="text-[11px] uppercase tracking-wider font-semibold mb-1">
          Amount in Words
        </div>
        <div className="font-medium">{amountInWords(total)}</div>
      </div>
      <div className="flex justify-end">
        <table className="text-sm border border-black border-collapse w-80">
          <tbody>
            <tr className="border-b border-black">
              <td className="px-3 py-2 border-r border-black font-semibold">Subtotal</td>
              <td className="px-3 py-2 text-right">&#8377; {subtotal.toFixed(2)}</td>
            </tr>
            {discount > 0 && (
              <tr className="border-b border-black">
                <td className="px-3 py-2 border-r border-black font-semibold">Discount</td>
                <td className="px-3 py-2 text-right">&#8377; {discount.toFixed(2)}</td>
              </tr>
            )}
            <tr className="bg-black text-white">
              <td className="px-3 py-2 border-r border-black font-bold">TOTAL</td>
              <td className="px-3 py-2 text-right font-bold">&#8377; {total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
