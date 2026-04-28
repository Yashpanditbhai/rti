import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-3">
      {/* Left */}
      <div className="flex items-center gap-2 text-gray-600">
        <span className="whitespace-nowrap">Row Per Page</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span>Entries</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === page
                  ? 'text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={currentPage === page ? { backgroundColor: '#1e3a5f' } : {}}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
