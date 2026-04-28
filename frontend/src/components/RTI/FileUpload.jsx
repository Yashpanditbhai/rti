import { useRef, useState, useCallback } from 'react'
import { CloudUpload, X } from 'lucide-react'

const FileUpload = ({ label, accept = 'image/jpeg,image/jpg,application/pdf', onFileSelect, existingFile }) => {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFile = useCallback((file) => {
    if (file) {
      setSelectedFile(file)
      onFileSelect && onFileSelect(file)
    }
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleChange = useCallback((e) => {
    const file = e.target.files[0]
    handleFile(file)
  }, [handleFile])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    onFileSelect && onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [onFileSelect])

  return (
    <div className="flex-1">
      {label && (
        <label className="block text-sm text-gray-600 mb-1">{label}</label>
      )}

      {selectedFile || existingFile ? (
        <div className="border border-gray-300 rounded-md p-3 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CloudUpload size={18} className="text-gray-400" />
            <span>{selectedFile ? selectedFile.name : existingFile}</span>
          </div>
          <button type="button" onClick={removeFile} className="text-gray-400 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50/50'
          }`}
        >
          <CloudUpload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Drop file here or <span className="text-blue-600 font-medium">Click to browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Accepted: image/jpeg, image/jpg</p>
          <p className="text-xs text-gray-400">Size: 20 KB &ndash; 100 KB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}

export default FileUpload
