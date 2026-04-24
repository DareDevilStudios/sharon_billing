import { useEffect, useState } from 'react';
import { Customer } from '../types';
import { useStore } from '../store/useStore';
import Modal from './Modal';

interface CustomerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onUpdated?: (customer: Customer) => void;
}

export default function CustomerEditModal({
  isOpen,
  onClose,
  customer,
  onUpdated,
}: CustomerEditModalProps) {
  const { updateCustomer } = useStore();
  const [draft, setDraft] = useState<Customer>(customer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDraft(customer);
      setError('');
    }
  }, [isOpen, customer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name || !draft.address) {
      setError('Name and address are required');
      return;
    }
    setSaving(true);
    try {
      const update = {
        name: draft.name,
        phone: draft.phone || '',
        address: draft.address,
        gstNumber: draft.gstNumber?.trim() || '',
      };
      await updateCustomer(customer.id, update);
      onUpdated?.({ ...customer, ...update });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !saving && onClose()}
      title="Edit Customer"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            type="tel"
            value={draft.phone || ''}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={draft.address}
            onChange={(e) => setDraft({ ...draft, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GST Number (Optional)</label>
          <input
            type="text"
            value={draft.gstNumber || ''}
            onChange={(e) => setDraft({ ...draft, gstNumber: e.target.value.toUpperCase() })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 uppercase"
            placeholder="e.g. 29ABCDE1234F1Z5"
            maxLength={15}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
