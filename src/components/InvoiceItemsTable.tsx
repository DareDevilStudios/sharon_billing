import { SaleItem } from '../types';

interface ItemTotal extends SaleItem {
  effectiveQuantity: number;
  effectiveTotal: number;
}

interface InvoiceItemsTableProps {
  items: ItemTotal[];
}

export default function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
    <table className="w-full border-collapse border border-black text-sm mb-6">
      <thead>
        <tr className="border-b border-black">
          <th className="border-r border-black px-2 py-2 text-left font-semibold w-10">
            #
          </th>
          <th className="border-r border-black px-2 py-2 text-left font-semibold">
            Description
          </th>
          <th className="border-r border-black px-2 py-2 text-right font-semibold w-20">
            Qty
          </th>
          <th className="border-r border-black px-2 py-2 text-right font-semibold w-28">
            Rate
          </th>
          <th className="px-2 py-2 text-right font-semibold w-28">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index} className="border-b border-black align-top">
            <td className="border-r border-black px-2 py-2">{index + 1}</td>
            <td className="border-r border-black px-2 py-2">
              {item.productName}
              {item.returnedQuantity ? (
                <div className="text-xs italic">
                  (Returned: {item.returnedQuantity})
                </div>
              ) : null}
            </td>
            <td className="border-r border-black px-2 py-2 text-right">
              {item.effectiveQuantity}
            </td>
            <td className="border-r border-black px-2 py-2 text-right">
              {item.price.toFixed(2)}
            </td>
            <td className="px-2 py-2 text-right">
              {item.effectiveTotal.toFixed(2)}
            </td>
          </tr>
        ))}
        {Array.from({ length: Math.max(0, 5 - items.length) }).map((_, i) => (
          <tr key={`pad-${i}`} className="border-b border-black">
            <td className="border-r border-black px-2 py-2">&nbsp;</td>
            <td className="border-r border-black px-2 py-2">&nbsp;</td>
            <td className="border-r border-black px-2 py-2">&nbsp;</td>
            <td className="border-r border-black px-2 py-2">&nbsp;</td>
            <td className="px-2 py-2">&nbsp;</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
