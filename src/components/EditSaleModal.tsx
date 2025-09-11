import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import Modal from './Modal';
import CustomerSupplierSearch from './CustomerSupplierSearch';
import ItemsTable from './ItemsTable';
import TotalCard from './TotalCard';
import AddItemButton from './AddItemButton';
import Card from './Card';
import CustomerDetails from './CustomerDetails';
import { Customer, SaleItem, Sale } from '../types';
import { format } from 'date-fns';

interface EditSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  onSave: (updatedSale: Partial<Sale>) => Promise<void>;
}

export default function EditSaleModal({ isOpen, onClose, sale, onSave }: EditSaleModalProps) {
  const {
    products,
    customers,
    addCustomer,
    validateStock,
    fetchProducts,
    fetchCustomers,
    isProductsLoaded,
    isCustomersLoaded,
  } = useStore();
  
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState<number | null>(null);
  const [saleDate, setSaleDate] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [productSearches, setProductSearches] = useState<string[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when sale changes
  useEffect(() => {
    if (sale && isOpen) {
      setInvoiceNumber(sale.invoiceNumber);
      setSaleDate(sale.date);
      setVehicleNumber(sale.vehicleNumber || '');
      setDiscount(sale.discount);
      setItems(sale.items);
      // Initialize product searches with existing product names
      setProductSearches(sale.items.map(item => item.productName || ''));
      
      // Find and set customer
      const customer = customers.find(c => c.id === sale.customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setCustomerSearch(customer.name);
      }
      
      // Reset error message
      setErrorMessage('');
      setShowProductDropdown(null);
    }
  }, [sale, isOpen, customers]);

  useEffect(() => {
    if (!isProductsLoaded) {
      fetchProducts();
    }
    if (!isCustomersLoaded) {
      fetchCustomers();
    }
  }, [fetchProducts, fetchCustomers, isProductsLoaded, isCustomersLoaded]);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.address.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Convert Customer to Entity format for CustomerSupplierSearch
  const filteredCustomersAsEntities = filteredCustomers.map(customer => ({
    id: customer.id,
    name: customer.name,
    address: customer.address,
  }));

  const addItem = () => {
    setItems([
      ...items,
      {
        productId: '',
        productName: '',
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);
    setProductSearches([...productSearches, '']);
  };

  const updateItem = (index: number, field: string, value: number | string) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'productId') {
      const product = products.find((p) => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.price = product.salesPrice;
        item.total = item.quantity * product.salesPrice;
        
        // Update the product search for this item
        const newSearches = [...productSearches];
        newSearches[index] = product.name;
        setProductSearches(newSearches);
      }
    } else if (field === 'quantity') {
      const numValue = typeof value === 'string' ? parseInt(value) : value;
      item.quantity = numValue;
      item.total = numValue * item.price;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const updateProductSearch = (index: number, search: string) => {
    const newSearches = [...productSearches];
    newSearches[index] = search;
    setProductSearches(newSearches);
    setShowProductDropdown(index);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    setProductSearches(productSearches.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  const handleSave = async () => {
    if (!selectedCustomer) {
      setErrorMessage('Please select a customer');
      return;
    }

    const stockValidation = validateStock(items);
    if (!stockValidation.valid) {
      setErrorMessage(stockValidation.message);
      return;
    }

    setIsLoading(true);
    try {
      const updatedSale = {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items,
        subtotal,
        discount,
        total,
        date: saleDate,
        vehicleNumber,
        invoiceNumber,
      };

      await onSave(updatedSale);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update sale');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.address) {
      setErrorMessage('Please fill in customer name and address');
      return;
    }

    try {
      await addCustomer(newCustomer as Omit<Customer, 'id'>);
      setIsCustomerModalOpen(false);
      setNewCustomer({});
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to add customer');
    }
  };

  // Convert SaleItem to Item format for ItemsTable
  const itemsForTable = items.map(item => ({
    id: item.productId,
    name: item.productName,
    price: item.price,
    quantity: item.quantity,
    total: item.total,
  }));

  const renderProductSelect = (index: number) => {
    const currentItem = items[index];
    const displayValue = productSearches[index] || currentItem?.productName || '';
    
    return (
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => {
            updateProductSearch(index, e.target.value);
          }}
          onFocus={() => setShowProductDropdown(index)}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search product..."
        />
      {showProductDropdown === index && (
        <div 
          className="absolute z-[9999] w-full mt-1 bg-white rounded-md shadow-xl max-h-60 overflow-auto border border-gray-200"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}
        >
          {products
            .filter(product =>
              product.name.toLowerCase().includes((productSearches[index] || '').toLowerCase())
            )
            .map((product) => (
              <div
                key={product.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  updateItem(index, 'productId', product.id);
                  updateProductSearch(index, product.name);
                  setShowProductDropdown(null);
                }}
              >
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-gray-600">
                  Stock: {product.stockQuantity}
                </div>
              </div>
            ))}
        </div>
      )}
      </div>
    );
  };

  if (!sale) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Sale" size="xl">
      <div onClick={() => setShowProductDropdown(null)}>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{errorMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMessage('')}
            >
              ×
            </button>
          </div>
        )}
        
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter invoice number..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Date
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter vehicle number..."
              />
            </div>
          </div>

          <CustomerSupplierSearch
            label="Customer Name"
            searchValue={customerSearch}
            onSearchChange={(value) => {
              setCustomerSearch(value);
              setShowCustomerDropdown(true);
            }}
            showDropdown={showCustomerDropdown}
            filteredResults={filteredCustomersAsEntities}
            onSelect={(entity) => {
              const customer = customers.find(c => c.id === entity.id);
              if (customer) {
                setSelectedCustomer(customer);
                setCustomerSearch(customer.name);
                setShowCustomerDropdown(false);
              }
            }}
            onAddNew={() => setIsCustomerModalOpen(true)}
            placeholder="Search customer..."
          />

          {selectedCustomer && <CustomerDetails customer={selectedCustomer} />}

          <AddItemButton onClick={addItem} label="Add Item" />

          <ItemsTable
            items={itemsForTable}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
            renderItemSelect={(index) => renderProductSelect(index)}
          />

          <div className="mt-6">
            <TotalCard
              subtotal={subtotal}
              discount={discount}
              onDiscountChange={setDiscount}
              total={total}
              onSubmit={handleSave}
              submitLabel={isLoading ? "Saving..." : "Update Sale"}
              disabled={!selectedCustomer || items.length === 0 || isLoading}
            />
          </div>
        </Card>

        <Modal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          title="Add New Customer"
        >
          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                value={newCustomer.name || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={newCustomer.phone || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                value={newCustomer.address || ''}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCustomerModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Customer
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Modal>
  );
}
