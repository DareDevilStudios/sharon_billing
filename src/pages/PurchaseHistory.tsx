import React, { useState,useEffect } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Download, Trash2 } from 'lucide-react';
import ExportModal from '../components/ExportModal';
import Modal from '../components/Modal';
import { exportToPdf } from '../utils/exportPdf';

export default function PurchaseHistory() {
  const { purchases, fetchPurchases, isPurchasesLoaded, deletePurchase, rawMaterials, fetchRawMaterials, isRawMaterialsLoaded } = useStore();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');

  useEffect(() => {
    if (!isPurchasesLoaded) {
      fetchPurchases();
    }
    if (!isRawMaterialsLoaded) {
      fetchRawMaterials();
    }
  }, [fetchPurchases, isPurchasesLoaded, fetchRawMaterials, isRawMaterialsLoaded]);

  const handleExport = async (startDate: string, endDate: string) => {
    await exportToPdf(purchases, startDate, endDate, 'purchases');
  };

  const formatMaterialsList = (items: Array<{ materialName: string; quantity: number }>) => {
    return items.map(item => `${item.materialName}(${item.quantity})`).join(', ');
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Purchase History</h1>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Materials
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((purchase) => (
              <tr key={purchase.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(purchase.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  #{purchase.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {purchase.supplierName}
                </td>
                <td className="px-6 py-4">
                  {formatMaterialsList(purchase.items)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{purchase.subtotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    className="text-red-600 hover:text-red-800 inline-flex items-center"
                    title="Delete Purchase"
                    onClick={() => {
                      setSelectedPurchaseId(purchase.id);
                      setDeleteError('');
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Export Purchases Report"
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Purchase"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{deleteError}</div>
          )}
          <p>Are you sure you want to delete this purchase? This will roll back the raw material stock received in this purchase.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!selectedPurchaseId) return;
                // Pre-check availability before deletion
                const purchase = purchases.find(p => p.id === selectedPurchaseId);
                if (!purchase) {
                  setDeleteError('Purchase not found');
                  return;
                }
                for (const item of purchase.items) {
                  const material = rawMaterials.find(m => m.id === item.materialId);
                  if (!material) {
                    setDeleteError(`Material not found: ${item.materialName}`);
                    return;
                  }
                  if (material.stock < item.quantity) {
                    setDeleteError(`Cannot delete. Not enough stock to rollback ${item.materialName}. Current: ${material.stock}, required: ${item.quantity}`);
                    return;
                  }
                }
                try {
                  await deletePurchase(selectedPurchaseId);
                  setIsDeleteModalOpen(false);
                  setSelectedPurchaseId(null);
                } catch (e) {
                  setDeleteError(e instanceof Error ? e.message : 'Failed to delete purchase');
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}