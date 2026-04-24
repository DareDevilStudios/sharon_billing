import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Customer } from '../types';
import CustomerEditModal from './CustomerEditModal';

interface CustomerDetailsProps {
  customer: Customer;
  onUpdated?: (customer: Customer) => void;
}

export default function CustomerDetails({ customer, onUpdated }: CustomerDetailsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Customer Details</h3>
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name:</p>
          <p className="font-medium">{customer.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Phone:</p>
          <p className="font-medium">{customer.phone || '-'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-600">Address:</p>
          <p className="font-medium">{customer.address}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-600">GST Number:</p>
          <p className="font-medium">{customer.gstNumber || '-'}</p>
        </div>
      </div>

      <CustomerEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        customer={customer}
        onUpdated={onUpdated}
      />
    </div>
  );
}
