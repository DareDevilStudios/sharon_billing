import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { RawMaterial } from '../types';
import { useStore } from '../store/useStore';

export default function RawMaterials() {
  const { rawMaterials, addRawMaterial, updateRawMaterial, deleteRawMaterial } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    threshold: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedMaterial) {
      await updateRawMaterial(selectedMaterial.id, formData);
    } else {
      await addRawMaterial(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (material: RawMaterial) => {
    setSelectedMaterial(material);
    setFormData({
      name: material.name,
      stock: material.stock,
      threshold: material.threshold,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      await deleteRawMaterial(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      stock: 0,
      threshold: 0,
    });
    setSelectedMaterial(null);
    setIsEditMode(false);
  };

  const getStockStatus = (material: RawMaterial) => {
    return material.stock < material.threshold ? (
      <span className="text-red-600 font-medium">Low Stock</span>
    ) : (
      <span className="text-green-600 font-medium">Sufficient</span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Raw Materials</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Material
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Threshold
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
            {rawMaterials.map((material) => (
              <tr key={material.id}>
                <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.threshold}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStockStatus(material)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={isEditMode ? "Edit Material" : "Add New Material"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Material Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Threshold
            </label>
            <input
              type="number"
              value={formData.threshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  threshold: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditMode ? "Update" : "Add"} Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}