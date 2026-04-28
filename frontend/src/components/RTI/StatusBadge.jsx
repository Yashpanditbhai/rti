const statusConfig = {
  Verified: '#22c55e',
  Pending: '#f97316',
  Rejected: '#ef4444',
  Draft: '#ca8a04',
  'Save Draft': '#ca8a04',
}

const displayName = {
  Draft: 'Save Draft',
}

const StatusBadge = ({ status }) => {
  const color = statusConfig[status] || '#6b7280'
  const label = displayName[status] || status
  return (
    <span className="font-bold text-sm whitespace-nowrap" style={{ color }}>
      {label}
    </span>
  )
}

export default StatusBadge
