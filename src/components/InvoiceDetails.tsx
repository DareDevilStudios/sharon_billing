import { Customer } from '../types';

interface InvoiceDetailsProps {
  invoiceNumber: string;
  date: string;
  customer: Customer;
  vehicleNumber?: string;
}

export default function InvoiceDetails({
  invoiceNumber,
  date,
  customer,
  vehicleNumber,
}: InvoiceDetailsProps) {
  return (
    <div className="grid grid-cols-2 border border-black mb-6 text-sm">
      <div className="p-3 border-r border-black">
        <div className="text-[11px] uppercase tracking-wider font-semibold mb-1">
          Bill To
        </div>
        <div className="font-semibold">{customer.name}</div>
        <div>{customer.address}</div>
        {customer.phone && <div>Phone: {customer.phone}</div>}
        {customer.gstNumber && <div>GSTIN: {customer.gstNumber}</div>}
      </div>
      <div className="p-3 space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">Invoice No:</span>
          <span>#{invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Date:</span>
          <span>{new Date(date).toLocaleDateString('en-GB')}</span>
        </div>
        {vehicleNumber && (
          <div className="flex justify-between">
            <span className="font-semibold">Vehicle No:</span>
            <span>{vehicleNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
}
