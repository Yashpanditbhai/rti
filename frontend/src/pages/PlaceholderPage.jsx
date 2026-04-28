import { Construction } from 'lucide-react'

const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center py-24">
    <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-md">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1e3a5f15' }}>
        <Construction size={28} style={{ color: '#1e3a5f' }} />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500">This module is under development and will be available soon.</p>
    </div>
  </div>
)

export default PlaceholderPage
