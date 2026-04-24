import { useEffect, useMemo, useState } from 'react';
import { Pencil, Search, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import CustomerEditModal from '../components/CustomerEditModal';
import { Customer } from '../types';

export default function Customers() {
  const { customers, fetchCustomers, isCustomersLoaded } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Customer | null>(null);

  useEffect(() => {
    if (!isCustomersLoaded) {
      fetchCustomers();
    }
  }, [fetchCustomers, isCustomersLoaded]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...customers].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted;
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.address || '').toLowerCase().includes(q) ||
        (c.gstNumber || '').toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div>
      <PageHeader title="Customers" />

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, address, or GST..."
            className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {filtered.length} of {customers.length} customers
        </div>
      </div>

      {!isCustomersLoaded ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Loading customers...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          {customers.length === 0
            ? 'No customers yet. Add one from a new sale.'
            : 'No customers match your search.'}
        </div>
      ) : (
        <>
          <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {c.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{c.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {c.gstNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setEditing(c)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-medium text-gray-900">{c.name}</div>
                  <button
                    onClick={() => setEditing(c)}
                    className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm flex-shrink-0"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="text-gray-500">Phone: </span>
                    {c.phone || '-'}
                  </div>
                  <div>
                    <span className="text-gray-500">Address: </span>
                    {c.address}
                  </div>
                  <div>
                    <span className="text-gray-500">GST: </span>
                    {c.gstNumber || '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <CustomerEditModal
          isOpen={editing !== null}
          onClose={() => setEditing(null)}
          customer={editing}
        />
      )}
    </div>
  );
}
