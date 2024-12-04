import React, { useState } from 'react';
import Modal from './Modal';
import { ReturnItem } from '../types';

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReturnItem[];
  onConfirm: (returnedItems: ReturnItem[]) => void;
}

export default function ReturnModal({ isOpen, onClose, items, onConfirm }: ReturnModalProps) {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>(items);

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...returnItems];
    newItems[index] = {
      ...newItems[index],
      returnQuantity: Math.min(Math.max(0, quantity), newItems[index].maxQuantity)
    };
    setReturnItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(returnItems);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Return Items">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          {returnItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {item.productName}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={item.returnQuantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                  min="0"
                  max={item.maxQuantity}
                  className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">
                  / {item.maxQuantity} available
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Return
          </button>
        </div>
      </form>
    </Modal>
  );
}