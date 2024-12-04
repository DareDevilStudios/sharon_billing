import React from 'react';
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
    <table className="min-w-full divide-y divide-gray-200 mb-6">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Product
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">
              {item.productName}
              {item.returnedQuantity ? (
                <div className="text-sm text-red-600">
                  (Returned: {item.returnedQuantity})
                </div>
              ) : null}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {item.effectiveQuantity}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
            <td className="px-6 py-4 whitespace-nowrap">₹{item.effectiveTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}