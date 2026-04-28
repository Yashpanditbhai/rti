const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title || 'Confirm Delete'}</h3>
        <p className="text-sm text-gray-600 mb-6">{message || 'Are you sure? This action cannot be undone.'}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
