import { useEffect, useState } from 'react';
import { AlertTriangle, Save, RotateCcw, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

type ResetTarget = 'sales' | 'expenses' | 'purchases' | 'manufacturing' | 'rawMaterials' | 'inventory';

const RESET_LABEL: Record<ResetTarget, string> = {
  sales: 'Sales',
  expenses: 'Expenses',
  purchases: 'Purchases',
  manufacturing: 'Manufacturing',
  rawMaterials: 'Raw Materials',
  inventory: 'Inventory'
};

export default function Settings() {
  const {
    systemConfig,
    isSystemConfigLoaded,
    fetchSystemConfig,
    saveInvoiceNumber,
    resetSales,
    resetExpenses,
    resetPurchases,
    resetManufacturing,
    resetRawMaterials,
    resetInventory
  } = useStore();

  const [invoiceInput, setInvoiceInput] = useState('');
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [invoiceMessage, setInvoiceMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [confirmTarget, setConfirmTarget] = useState<ResetTarget | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isSystemConfigLoaded) {
      fetchSystemConfig();
    }
  }, [fetchSystemConfig, isSystemConfigLoaded]);

  useEffect(() => {
    if (systemConfig) {
      setInvoiceInput(String(systemConfig.lastInvoiceNumber));
    }
  }, [systemConfig]);

  const handleSaveInvoice = async () => {
    const parsed = parseInt(invoiceInput, 10);
    if (isNaN(parsed) || parsed < 0) {
      setInvoiceMessage({ type: 'error', text: 'Enter a valid non-negative number' });
      return;
    }
    setSavingInvoice(true);
    setInvoiceMessage(null);
    try {
      await saveInvoiceNumber(parsed);
      await fetchSystemConfig();
      setInvoiceMessage({ type: 'success', text: `Next invoice will be ${(parsed + 1).toString().padStart(5, '0')}` });
    } catch (err) {
      setInvoiceMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save' });
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleResetInvoice = async () => {
    setSavingInvoice(true);
    setInvoiceMessage(null);
    try {
      await saveInvoiceNumber(0);
      await fetchSystemConfig();
      setInvoiceInput('0');
      setInvoiceMessage({ type: 'success', text: 'Invoice counter reset to 0. Next invoice will be 00001' });
    } catch (err) {
      setInvoiceMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to reset' });
    } finally {
      setSavingInvoice(false);
    }
  };

  const openConfirm = (target: ResetTarget) => {
    setConfirmTarget(target);
    setConfirmText('');
    setResetMessage(null);
  };

  const closeConfirm = () => {
    if (resetting) return;
    setConfirmTarget(null);
    setConfirmText('');
  };

  const handleConfirmReset = async () => {
    if (!confirmTarget) return;
    setResetting(true);
    try {
      if (confirmTarget === 'sales') await resetSales();
      else if (confirmTarget === 'expenses') await resetExpenses();
      else if (confirmTarget === 'purchases') await resetPurchases();
      else if (confirmTarget === 'manufacturing') await resetManufacturing();
      else if (confirmTarget === 'rawMaterials') await resetRawMaterials();
      else if (confirmTarget === 'inventory') await resetInventory();
      setResetMessage({ type: 'success', text: `All ${RESET_LABEL[confirmTarget]} data erased` });
      setConfirmTarget(null);
      setConfirmText('');
    } catch (err) {
      setResetMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to reset' });
    } finally {
      setResetting(false);
    }
  };

  const resetTargets: ResetTarget[] = ['sales', 'expenses', 'purchases', 'manufacturing', 'rawMaterials', 'inventory'];
  const confirmPhrase = confirmTarget ? `RESET ${RESET_LABEL[confirmTarget].toUpperCase()}` : '';

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Invoice Number</h2>
        <p className="text-sm text-gray-500 mb-4">
          This is the last used invoice number. The next sale's invoice will be this value + 1.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last invoice number
            </label>
            <input
              type="number"
              min={0}
              value={invoiceInput}
              onChange={(e) => setInvoiceInput(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={!isSystemConfigLoaded || savingInvoice}
            />
          </div>
          <button
            onClick={handleSaveInvoice}
            disabled={!isSystemConfigLoaded || savingInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
          <button
            onClick={handleResetInvoice}
            disabled={!isSystemConfigLoaded || savingInvoice}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to 0
          </button>
        </div>
        {invoiceMessage && (
          <div
            className={`mt-3 text-sm ${
              invoiceMessage.type === 'success' ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {invoiceMessage.text}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Danger Zone</h2>
            <p className="text-sm text-gray-500">
              Erase all data from a section. This cannot be undone and will not adjust stock.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {resetTargets.map((t) => (
            <div
              key={t}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-800">{RESET_LABEL[t]}</div>
                <div className="text-xs text-gray-500">Erase all {RESET_LABEL[t].toLowerCase()} records</div>
              </div>
              <button
                onClick={() => openConfirm(t)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>
          ))}
        </div>

        {resetMessage && (
          <div
            className={`mt-4 text-sm ${
              resetMessage.type === 'success' ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {resetMessage.text}
          </div>
        )}
      </div>

      <Modal
        isOpen={confirmTarget !== null}
        onClose={closeConfirm}
        title={`Reset ${confirmTarget ? RESET_LABEL[confirmTarget] : ''}`}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This will permanently delete <strong>all {confirmTarget && RESET_LABEL[confirmTarget].toLowerCase()}</strong> records.
              This action cannot be undone.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-mono text-red-600">{confirmPhrase}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeConfirm}
              disabled={resetting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              disabled={resetting || confirmText !== confirmPhrase}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {resetting ? 'Resetting...' : 'Reset'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
