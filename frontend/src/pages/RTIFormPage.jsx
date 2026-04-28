import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { createRTI, getRTIById, updateRTI } from '../api/rtiApi'
import FileUpload from '../components/RTI/FileUpload'

const departments = ['Manager', 'Supervisor', 'Accountant', 'HR', 'Legal', 'IT', 'Finance', 'Administration']
const officers = ['Mr. Rajesh Kumar', 'Ms. Priya Sharma', 'Mr. Amit Singh', 'Ms. Neha Gupta', 'Mr. Vikram Patel']
const genders = ['Male', 'Female', 'Other']
const applicationModes = ['Online', 'Offline', 'Email', 'Post']
const reminderFrequencies = ['Daily', '3 Days', 'Weekly', 'Monthly']

const initialFormState = {
  applicantName: '',
  gender: '',
  contactNumber: '',
  email: '',
  address: '',
  rtiCaseNumber: '',
  subject: '',
  applicationMode: '',
  dateOfReceipt: '',
  description: '',
  department: '',
  assignedOfficer: '',
  dueDate: '',
  extendedDueDate: '',
  reminderFrequency: '',
}

const RTIFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [applicationFile, setApplicationFile] = useState(null)
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [existingApplicationFile, setExistingApplicationFile] = useState(null)
  const [existingAttachmentFile, setExistingAttachmentFile] = useState(null)

  useEffect(() => {
    if (isEditMode) {
      fetchRTI()
    } else {
      generateCaseNumber()
    }
  }, [id])

  const generateCaseNumber = () => {
    const year = new Date().getFullYear()
    const random = String(Math.floor(Math.random() * 9000) + 1000)
    setForm((prev) => ({
      ...prev,
      rtiCaseNumber: `RTI/${year}/DEPT/${random}`,
    }))
  }

  const fetchRTI = async () => {
    try {
      setFetching(true)
      const data = await getRTIById(id)
      const rti = data.data || data
      setForm({
        applicantName: rti.applicantName || '',
        gender: rti.gender || '',
        contactNumber: rti.contactNumber || '',
        email: rti.email || '',
        address: rti.address || '',
        rtiCaseNumber: rti.rtiCaseNumber || '',
        subject: rti.subject || '',
        applicationMode: rti.applicationMode || '',
        dateOfReceipt: rti.dateOfReceipt ? rti.dateOfReceipt.slice(0, 10) : '',
        description: rti.description || '',
        department: rti.department || '',
        assignedOfficer: rti.assignedOfficer || '',
        dueDate: rti.dueDate ? rti.dueDate.slice(0, 10) : '',
        extendedDueDate: rti.extendedDueDate ? rti.extendedDueDate.slice(0, 10) : '',
        reminderFrequency: rti.reminderFrequency || '',
      })
      if (rti.documents && rti.documents.length > 0) {
        setExistingApplicationFile(rti.documents[0]?.originalName)
        if (rti.documents.length > 1) setExistingAttachmentFile(rti.documents[1]?.originalName)
      }
    } catch (error) {
      toast.error('Failed to fetch RTI details')
      navigate('/')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.applicantName.trim()) newErrors.applicantName = 'Applicant Name is required'
    if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact Number is required'
    if (!form.rtiCaseNumber.trim()) newErrors.rtiCaseNumber = 'RTI Case Number is required'
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.applicationMode) newErrors.applicationMode = 'Application Mode is required'
    if (!form.dateOfReceipt) newErrors.dateOfReceipt = 'Date of Receipt is required'
    if (!form.department) newErrors.department = 'Department is required'
    if (!form.dueDate) newErrors.dueDate = 'Due Date is required'
    if (!form.reminderFrequency) newErrors.reminderFrequency = 'Reminder Frequency is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildFormData = (status) => {
    const fd = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value)
    })
    fd.append('status', status)
    if (applicationFile) fd.append('application', applicationFile)
    if (attachmentFile) fd.append('attachments', attachmentFile)
    return fd
  }

  const handleSubmit = async (status = 'Pending') => {
    if (status === 'Pending' && !validate()) {
      toast.error('Please fill all required fields')
      return
    }
    try {
      setLoading(true)
      const fd = buildFormData(status)
      if (isEditMode) {
        await updateRTI(id, fd)
        toast.success('RTI updated successfully')
      } else {
        await createRTI(fd)
        toast.success('RTI created successfully')
      }
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  const inputClasses = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`

  const selectClasses = (field) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white transition-colors cursor-pointer ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`

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
        <h2 className="text-lg font-semibold text-gray-800">
          {isEditMode ? 'Edit RTI Registration' : 'RTI Registration'}
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Applicant Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Applicant Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Applicant Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="applicantName"
                value={form.applicantName}
                onChange={handleChange}
                placeholder="Enter applicant name"
                className={inputClasses('applicantName')}
              />
              {errors.applicantName && <p className="text-red-500 text-xs mt-1">{errors.applicantName}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={selectClasses('gender')}
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Contact Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                className={inputClasses('contactNumber')}
              />
              {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email ID</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={inputClasses('email')}
              />
            </div>
            <div className="md:col-span-1 lg:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
                className={inputClasses('address')}
              />
            </div>
          </div>
        </div>

        {/* RTI Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            RTI Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                RTI Case Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rtiCaseNumber"
                value={form.rtiCaseNumber}
                disabled
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Subject<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className={inputClasses('subject')}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Application Mode<span className="text-red-500">*</span>
              </label>
              <select
                name="applicationMode"
                value={form.applicationMode}
                onChange={handleChange}
                className={selectClasses('applicationMode')}
              >
                <option value="">Select Mode</option>
                {applicationModes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {errors.applicationMode && <p className="text-red-500 text-xs mt-1">{errors.applicationMode}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Date of Receipt<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfReceipt"
                value={form.dateOfReceipt}
                onChange={handleChange}
                className={inputClasses('dateOfReceipt')}
              />
              {errors.dateOfReceipt && <p className="text-red-500 text-xs mt-1">{errors.dateOfReceipt}</p>}
            </div>
            <div className="md:col-span-1 lg:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
                className={inputClasses('description')}
              />
            </div>
          </div>
        </div>

        {/* Department Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Department Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Department<span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={selectClasses('department')}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Assigned Officer</label>
              <select
                name="assignedOfficer"
                value={form.assignedOfficer}
                onChange={handleChange}
                className={selectClasses('assignedOfficer')}
              >
                <option value="">Select Officer</option>
                {officers.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Details */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Timeline Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Due Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={inputClasses('dueDate')}
              />
              {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Extended Due Date</label>
              <input
                type="date"
                name="extendedDueDate"
                value={form.extendedDueDate}
                onChange={handleChange}
                className={inputClasses('extendedDueDate')}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Reminder Frequency<span className="text-red-500">*</span>
              </label>
              <select
                name="reminderFrequency"
                value={form.reminderFrequency}
                onChange={handleChange}
                className={selectClasses('reminderFrequency')}
              >
                <option value="">Select Frequency</option>
                {reminderFrequencies.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              {errors.reminderFrequency && <p className="text-red-500 text-xs mt-1">{errors.reminderFrequency}</p>}
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Upload Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload
              label="Upload Application (PDF/Image)"
              accept="image/jpeg,image/jpg,application/pdf"
              onFileSelect={setApplicationFile}
              existingFile={existingApplicationFile}
            />
            <FileUpload
              label="Additional Attachments"
              accept="image/jpeg,image/jpg,application/pdf"
              onFileSelect={setAttachmentFile}
              existingFile={existingAttachmentFile}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={loading}
            className="px-6 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('Pending')}
            disabled={loading}
            className="px-6 py-2 text-sm text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: '#1e3a5f' }}
          >
            {loading && <Loader2 className="animate-spin" size={14} />}
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default RTIFormPage
