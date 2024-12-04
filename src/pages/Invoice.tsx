import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { useStore } from '../store/useStore';
import CancelledTag from '../components/CancelledTag';
import InvoiceHeader from '../components/InvoiceHeader';
import InvoiceDetails from '../components/InvoiceDetails';
import InvoiceItemsTable from '../components/InvoiceItemsTable';
import InvoiceTotals from '../components/InvoiceTotals';

export default function Invoice() {
  const { id } = useParams();
  const { 
    sales, 
    customers, 
    fetchSales, 
    fetchCustomers,
    isSalesLoaded,
    isCustomersLoaded
  } = useStore();

  useEffect(() => {
    if (!isSalesLoaded) {
      fetchSales();
    }
    if (!isCustomersLoaded) {
      fetchCustomers();
    }
  }, [fetchSales, fetchCustomers, isSalesLoaded, isCustomersLoaded]);
  
  const sale = sales.find(s => s.id === id);
  const customer = customers.find(c => sale && c.id === sale.customerId);

  // Show loading state while data is being fetched
  if (!isSalesLoaded || !isCustomersLoaded) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!sale || !customer) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-gray-600">Invoice not found</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Calculate totals considering returned items
  const itemTotals = sale.items.map(item => ({
    ...item,
    effectiveQuantity: item.quantity - (item.returnedQuantity || 0),
    effectiveTotal: (item.quantity - (item.returnedQuantity || 0)) * item.price
  }));

  const effectiveSubtotal = itemTotals.reduce((sum, item) => sum + item.effectiveTotal, 0);
  const effectiveTotal = effectiveSubtotal - sale.discount;

  return (
    <>
      <div className="print:hidden max-w-3xl mx-auto mb-6 flex justify-between items-center">
        {sale.isCancelled && (
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg border-2 border-red-200 font-bold">
            This sale has been cancelled
          </div>
        )}
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 ml-auto"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Invoice
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 print:shadow-none print:rounded-none">
        {sale.isCancelled && <CancelledTag />}
        <InvoiceHeader />
        <InvoiceDetails 
          invoiceNumber={sale.invoiceNumber}
          date={sale.date}
          customer={customer}
        />
        <InvoiceItemsTable items={itemTotals} />
        <InvoiceTotals 
          subtotal={effectiveSubtotal}
          discount={sale.discount}
          total={effectiveTotal}
        />

        <div className="mt-12 text-center text-gray-600">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </>
  );
}