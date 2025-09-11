import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { FileText, Download, RotateCcw, XCircle, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import ExportModal from '../components/ExportModal';
import ReturnModal from '../components/ReturnModal';
import EditSaleModal from '../components/EditSaleModal';
import Modal from '../components/Modal';
import { exportToPdf } from '../utils/exportPdf';
import { ReturnItem, Sale } from '../types';

export default function SalesHistory() {
  const {
    sales,
    fetchSales,
    isSalesLoaded,
    cancelSale,
    returnSaleItems,
    updateSale
  } = useStore();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  
  useEffect(() => {
    if (!isSalesLoaded) {
      fetchSales();
    }
  }, [fetchSales, isSalesLoaded]);

  const handleExport = async (startDate: string, endDate: string) => {
    await exportToPdf(sales, startDate, endDate, 'sales');
  };

  const handleReturnClick = (sale: Sale) => {
    const items: ReturnItem[] = sale.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      currentQuantity: item.quantity,
      returnQuantity: 0,
      maxQuantity: item.quantity - (item.returnedQuantity || 0)
    }));
    setReturnItems(items);
    setSelectedSale(sale);
    setIsReturnModalOpen(true);
  };

  const handleCancelClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsCancelModalOpen(true);
  };

  const handleEditClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsEditModalOpen(true);
  };

  const handleReturnConfirm = async (returnedItems: ReturnItem[]) => {
    if (selectedSale) {
      try {
        await returnSaleItems(selectedSale.id, returnedItems);
        setIsReturnModalOpen(false);
        setSelectedSale(null);
      } catch (error) {
        console.error('Error returning items:', error);
      }
    }
  };

  const handleCancelConfirm = async () => {
    if (selectedSale) {
      try {
        await cancelSale(selectedSale.id);
        setIsCancelModalOpen(false);
        setSelectedSale(null);
      } catch (error) {
        console.error('Error cancelling sale:', error);
      }
    }
  };

  const handleEditSave = async (updatedSale: Partial<Sale>) => {
    if (selectedSale) {
      try {
        await updateSale(selectedSale.id, updatedSale);
        setIsEditModalOpen(false);
        setSelectedSale(null);
      } catch (error) {
        console.error('Error updating sale:', error);
        throw error; // Re-throw to let the modal handle the error
      }
    }
  };

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Sales History</h1>
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
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((sale) => (
              <tr key={sale.id} className={sale.isCancelled ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(sale.date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  #{sale.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sale.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sale.items.length} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{sale.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sale.isCancelled ? (
                    <span className="text-red-600 font-medium">Cancelled</span>
                  ) : (
                    <span className="text-green-600 font-medium">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link
                      to={`/invoice/${sale.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Invoice"
                    >
                      <FileText className="w-5 h-5" />
                    </Link>
                    {!sale.isCancelled && (
                      <>
                        <button
                          onClick={() => handleEditClick(sale)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Sale"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReturnClick(sale)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Return Items"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleCancelClick(sale)}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel Sale"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
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
        title="Export Sales Report"
      />

      {selectedSale && (
        <>
          <EditSaleModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSale(null);
            }}
            sale={selectedSale}
            onSave={handleEditSave}
          />

          <ReturnModal
            isOpen={isReturnModalOpen}
            onClose={() => {
              setIsReturnModalOpen(false);
              setSelectedSale(null);
            }}
            items={returnItems}
            onConfirm={handleReturnConfirm}
          />

          <Modal
            isOpen={isCancelModalOpen}
            onClose={() => {
              setIsCancelModalOpen(false);
              setSelectedSale(null);
            }}
            title="Cancel Sale"
          >
            <div className="space-y-4">
              <p>Are you sure you want to cancel this sale?</p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. The sale will be marked as cancelled.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setSelectedSale(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  No, Keep Sale
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Yes, Cancel Sale
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}