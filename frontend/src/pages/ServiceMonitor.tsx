import { useState, useEffect } from 'react'
import { api } from '../service/api'

type FailedService = {
  app: string
  service: string
  endpoint: string
  status: number
  lastFailure: string
  errorCount: number
  mockAvailable: boolean
  mockEnabled: boolean
  errorMessage?: string
}

export default function ServiceMonitor() {
  const [failedServices, setFailedServices] = useState<FailedService[]>([])
  const [filteredServices, setFilteredServices] = useState<FailedService[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortField, setSortField] = useState<keyof FailedService>('lastFailure')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState({
    app: '',
    service: '',
    status: '',
    mockAvailable: 'all'
  })

  // Mock data - replace with Splunk API integration
  const mockFailedServices: FailedService[] = [
    {
      app: 'PaymentsApp',
      service: 'TransactionService', 
      endpoint: '/api/transactions',
      status: 500,
      lastFailure: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      errorCount: 15,
      mockAvailable: true,
      mockEnabled: false
    },
    {
      app: 'UserApp',
      service: 'AuthService',
      endpoint: '/api/auth/login', 
      status: 503,
      lastFailure: new Date(Date.now() - 120000).toISOString(), // 2 min ago
      errorCount: 8,
      mockAvailable: true,
      mockEnabled: false
    },
    {
      app: 'NotificationApp',
      service: 'EmailService',
      endpoint: '/api/notifications/email',
      status: 404,
      lastFailure: new Date(Date.now() - 600000).toISOString(), // 10 min ago
      errorCount: 3,
      mockAvailable: false,
      mockEnabled: false
    }
  ]

  const fetchFailedServices = async () => {
    setRefreshing(true)
    try {
      const response = await api.get('/splunk/failed-services')
      setFailedServices(response.data.services || [])
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setFailedServices(mockFailedServices) // Fallback to mock data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSort = (field: keyof FailedService) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(direction)
  }

  const applyFiltersAndSort = () => {
    let filtered = failedServices.filter(service => {
      return (
        (!filters.app || service.app.toLowerCase().includes(filters.app.toLowerCase())) &&
        (!filters.service || service.service.toLowerCase().includes(filters.service.toLowerCase())) &&
        (!filters.status || service.status.toString().includes(filters.status)) &&
        (filters.mockAvailable === 'all' || 
         (filters.mockAvailable === 'true' && service.mockAvailable) ||
         (filters.mockAvailable === 'false' && !service.mockAvailable))
      )
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      if (sortField === 'lastFailure') {
        aVal = new Date(aVal as string).getTime()
        bVal = new Date(bVal as string).getTime()
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredServices(filtered)
  }



  useEffect(() => {
    fetchFailedServices()
    const interval = setInterval(fetchFailedServices, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [failedServices, sortField, sortDirection, filters])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading service status...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Service Monitor</h1>
          <p className="text-gray-600 mt-1">Monitor downstream service failures from Splunk integration</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">{filteredServices.length} of {failedServices.length} services</span>
          </div>
          <button 
            className="btn-secondary flex items-center space-x-2"
            onClick={fetchFailedServices}
            disabled={refreshing}
          >
            <span>{refreshing ? '🔄' : '↻'}</span>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="input"
            placeholder="Filter by App"
            value={filters.app}
            onChange={(e) => setFilters(prev => ({...prev, app: e.target.value}))}
          />
          <input
            className="input"
            placeholder="Filter by Service"
            value={filters.service}
            onChange={(e) => setFilters(prev => ({...prev, service: e.target.value}))}
          />
          <input
            className="input"
            placeholder="Filter by Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
          />
          <select
            className="input"
            value={filters.mockAvailable}
            onChange={(e) => setFilters(prev => ({...prev, mockAvailable: e.target.value}))}
          >
            <option value="all">All Mock Status</option>
            <option value="true">Mock Available</option>
            <option value="false">No Mock</option>
          </select>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">All Services Healthy</h3>
          <p className="text-gray-500">{failedServices.length === 0 ? 'No downstream service failures detected' : 'No services match the current filters'}</p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <SortableHeader field="status" label="Status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="app" label="Application" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="service" label="Service" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="endpoint" label="Endpoint" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="errorCount" label="Errors" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="lastFailure" label="Last Failure" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHeader field="mockAvailable" label="Mock Available" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Error Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, i) => (
                  <ServiceRow key={i} service={service} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-primary mb-3">🔗 Splunk Integration</h3>
        <p className="text-sm text-gray-600 mb-3">
          This page will integrate with Splunk API to automatically detect failing services based on error logs and response codes.
        </p>
        <div className="text-xs text-gray-500">
          <strong>Next Steps:</strong> Configure Splunk endpoint in application.yml and implement real-time monitoring
        </div>
      </div>
    </div>
  )
}

function SortableHeader({ field, label, sortField, sortDirection, onSort }: {
  field: keyof FailedService
  label: string
  sortField: keyof FailedService
  sortDirection: 'asc' | 'desc'
  onSort: (field: keyof FailedService) => void
}) {
  const isActive = sortField === field
  
  return (
    <th 
      className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="text-xs">
          {isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </div>
    </th>
  )
}

function ServiceRow({ service }: { service: FailedService }) {
  const getStatusColor = (status: number) => {
    if (status >= 500) return 'bg-red-500'
    if (status >= 400) return 'bg-orange-500'
    return 'bg-yellow-500'
  }

  const getTimeSince = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className={`inline-flex items-center px-2 py-1 rounded text-white text-xs font-medium ${getStatusColor(service.status)}`}>
          {service.status}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="font-medium text-gray-900">{service.app}</div>
      </td>
      <td className="py-3 px-4">
        <div className="font-medium text-gray-900">{service.service}</div>
      </td>
      <td className="py-3 px-4">
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{service.endpoint}</code>
      </td>
      <td className="py-3 px-4">
        <div className="font-medium text-red-600">{service.errorCount}</div>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm text-gray-600">{getTimeSince(service.lastFailure)}</div>
      </td>
      <td className="py-3 px-4">
        {service.mockAvailable ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ✓ Available
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ✗ Not Available
          </span>
        )}
      </td>
      <td className="py-3 px-4 max-w-xs">
        {service.errorMessage && (
          <div className="text-xs text-gray-600 truncate" title={service.errorMessage}>
            {service.errorMessage}
          </div>
        )}
      </td>
    </tr>
  )
}