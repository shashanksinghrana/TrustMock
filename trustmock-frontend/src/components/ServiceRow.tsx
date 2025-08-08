import Toggle from './Toggle'

type Props = {
  app: string
  service: string
  pin: string
  enabled: boolean
  lastUpdated?: string
  loading?: boolean
  onToggle: (v: boolean)=>void
  onSaveMock: ()=>void
}

export default function ServiceRow({ app, service, pin, enabled, lastUpdated, loading, onToggle, onSaveMock }: Props) {
  return (
    <div className={`card border-l-4 ${enabled ? 'border-l-success bg-green-50' : 'border-l-gray-300'} transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="font-semibold text-gray-900">{service}</div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              enabled ? 'bg-success text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {enabled ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{app}</span> • <code className="bg-gray-100 px-1 rounded">{pin}</code>
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-400 mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="btn-secondary text-sm" 
            onClick={onSaveMock}
            disabled={loading}
          >
            {loading ? 'Loading...' : '✏️ Edit Mock'}
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Enable</span>
            <Toggle checked={enabled} onChange={onToggle} disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
