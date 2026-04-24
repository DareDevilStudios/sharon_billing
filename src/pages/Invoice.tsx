import { useEffect } from 'react';
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
    isCustomersLoaded,
  } = useStore();

  useEffect(() => {
    if (!isSalesLoaded) fetchSales();
    if (!isCustomersLoaded) fetchCustomers();
  }, [fetchSales, fetchCustomers, isSalesLoaded, isCustomersLoaded]);

  const sale = sales.find((s) => s.id === id);
  const customer = customers.find((c) => sale && c.id === sale.customerId);

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

  const handlePrint = () => window.print();

  const itemTotals = sale.items.map((item) => ({
    ...item,
    effectiveQuantity: item.quantity - (item.returnedQuantity || 0),
    effectiveTotal:
      (item.quantity - (item.returnedQuantity || 0)) * item.price,
  }));

  const effectiveSubtotal = itemTotals.reduce(
    (sum, item) => sum + item.effectiveTotal,
    0
  );
  const effectiveTotal = effectiveSubtotal - sale.discount;

  return (
    <>
      <div className="print:hidden max-w-[210mm] mx-auto mb-4 flex justify-between items-center gap-4">
        {sale.isCancelled ? (
          <div className="px-3 py-1 border-2 border-red-600 text-red-700 rounded font-bold text-sm">
            This sale has been cancelled
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Invoice
        </button>
      </div>

      <div className="invoice-sheet max-w-[210mm] mx-auto bg-white border border-gray-300 p-10 text-black">
        {sale.isCancelled && <CancelledTag />}
        <InvoiceHeader />
        <InvoiceDetails
          invoiceNumber={sale.invoiceNumber}
          date={sale.date}
          customer={customer}
          vehicleNumber={sale.vehicleNumber}
        />
        <InvoiceItemsTable items={itemTotals} />
        <InvoiceTotals
          subtotal={effectiveSubtotal}
          discount={sale.discount}
          total={effectiveTotal}
        />

        <div className="grid grid-cols-2 gap-8 text-sm mt-10">
          <div>
            <div className="font-semibold mb-1">Terms &amp; Conditions</div>
            <div className="text-xs leading-relaxed">
              Goods once sold will not be taken back. All disputes are subject
              to local jurisdiction.
            </div>
          </div>
          <div className="text-right">
            <div className="h-16 border-b border-black mb-1"></div>
            <div className="text-xs font-semibold">
              Authorized Signatory
            </div>
            <div className="text-xs">For SHARON INDUSTRIES</div>
          </div>
        </div>
      </div>
    </>
  );
}
