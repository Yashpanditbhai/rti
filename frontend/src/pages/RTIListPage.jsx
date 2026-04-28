import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllRTIs, deleteRTI } from '../api/rtiApi'
import StatusBadge from '../components/RTI/StatusBadge'
import Pagination from '../components/ui/Pagination'
import ConfirmModal from '../components/ui/ConfirmModal'

const RTIListPage = () => {
  const navigate = useNavigate()
  const [rtis, setRtis] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filters, setFilters] = useState({ department: '', status: '' })
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })

  const fetchRTIs = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: rowsPerPage,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
      }
      const response = await getAllRTIs(params)
      if (response && response.data) {
        setRtis(response.data)
        setTotalCount(response.pagination?.total || response.data.length)
      } else {
        setRtis([])
        setTotalCount(0)
      }
    } catch (error) {
      console.error('Failed to fetch RTIs:', error)
      setRtis([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, rowsPerPage, filters])

  useEffect(() => { fetchRTIs() }, [fetchRTIs])

  const handleDelete = async () => {
    if (!deleteModal.id) return
    try {
      await deleteRTI(deleteModal.id)
      toast.success('RTI deleted successfully')
      setDeleteModal({ open: false, id: null })
      fetchRTIs()
    } catch { toast.error('Failed to delete RTI') }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage))

  return (
    <div>
      {/* Top: RTI Registration button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/rti/new')}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          style={{ backgroundColor: '#1e3a5f' }}
        >
          <Plus size={16} />
          RTI Registration
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Count + Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-2xl font-bold text-gray-800">{totalCount}</span>
              <span className="text-sm text-gray-500 ml-2">RTI</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer">
                <option value="">Date</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Department</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Accountant">Accountant</option>
                <option value="HR">HR</option>
                <option value="Legal">Legal</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Administration">Administration</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
              >
                <option value="">Status</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Draft">Save Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-800 text-sm">RTI No.</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 text-sm">Applicant</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 text-sm">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 text-sm">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 text-sm">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-800 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Loader2 className="animate-spin mx-auto text-gray-300" size={28} />
                    <p className="text-gray-400 mt-2 text-sm">Loading...</p>
                  </td>
                </tr>
              ) : rtis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">No RTI records found.</td>
                </tr>
              ) : (
                rtis.map((rti, index) => (
                  <tr key={rti._id || index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{rti.rtiCaseNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{rti.applicantName || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{rti.department || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {rti.dateOfReceipt ? new Date(rti.dateOfReceipt).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={rti.status || 'Pending'} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/rti/${rti._id}`)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => navigate(`/rti/${rti._id}/edit`)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-400 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: rti._id })}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(val) => { setRowsPerPage(val); setCurrentPage(1) }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete RTI"
        message="Are you sure you want to delete this RTI application? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  )
}

export default RTIListPage
