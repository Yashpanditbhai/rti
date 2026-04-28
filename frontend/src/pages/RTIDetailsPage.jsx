import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { getRTIById } from '../api/rtiApi'

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || '-'}</p>
  </div>
)

const RTIDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rti, setRti] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRTI = async () => {
      try {
        setLoading(true)
        const data = await getRTIById(id)
        setRti(data.data || data)
      } catch (error) {
        toast.error('Failed to fetch RTI details')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchRTI()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  if (!rti) {
    return (
      <div className="text-center py-20 text-gray-500">
        RTI record not found.
      </div>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 hover:bg-white rounded-md transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">RTI Registration Details</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Applicant Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Applicant Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <DetailField label="Applicant Name" value={rti.applicantName} />
            <DetailField label="Gender" value={rti.gender} />
            <DetailField label="Contact Number" value={rti.contactNumber} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailField label="Email ID" value={rti.email} />
            <div className="md:col-span-1 lg:col-span-2">
              <DetailField label="Address" value={rti.address} />
            </div>
          </div>
        </div>

        {/* RTI Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            RTI Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <DetailField label="RTI Case Number" value={rti.rtiCaseNumber} />
            <DetailField label="Subject" value={rti.subject} />
            <DetailField label="Application Mode" value={rti.applicationMode} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailField label="Date of Receipt" value={formatDate(rti.dateOfReceipt)} />
            <div className="md:col-span-1 lg:col-span-2">
              <DetailField label="Description" value={rti.description} />
            </div>
          </div>
        </div>

        {/* Department Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Department Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailField label="Department" value={rti.department} />
            <DetailField label="Assigned Officer" value={rti.assignedOfficer} />
          </div>
        </div>

        {/* Timeline Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Timeline Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailField label="Due Date" value={formatDate(rti.dueDate)} />
            <DetailField label="Extended Due Date" value={formatDate(rti.extendedDueDate)} />
            <DetailField label="Reminder Frequency" value={rti.reminderFrequency} />
          </div>
        </div>

        {/* Uploaded Documents */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Uploaded Documents Details
          </h3>
          {rti.documents && rti.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rti.documents.map((doc, idx) => (
                <div key={idx}>
                  <p className="text-xs text-gray-500 mb-2">{idx === 0 ? 'Upload Application' : 'Additional Attachments'}</p>
                  <a
                    href={`/uploads/${doc.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={20} className="text-blue-600" />
                    <span className="text-sm text-blue-600 underline">{doc.originalName || 'View Document'}</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No documents uploaded</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RTIDetailsPage
