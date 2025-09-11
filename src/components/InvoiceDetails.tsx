import React from 'react';
import { Customer } from '../types';

interface InvoiceDetailsProps {
  invoiceNumber: string;
  date: string;
  customer: Customer;
}

export default function InvoiceDetails({ invoiceNumber, date, customer }: InvoiceDetailsProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Invoice</h2>
          <p className="text-gray-600">Invoice No: #{invoiceNumber}</p>
          <p className="text-gray-600">
            Date: {new Date(date).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-1">Bill To:</h3>
          <p className="text-gray-600">{customer.name}</p>
          {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
          <p className="text-gray-600">{customer.address}</p>
        </div>
      </div>
    </div>
  );
}