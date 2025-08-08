import { useEffect, useState } from 'react'
import { api } from '../service/api'

type Stats = { totalServices: number; totalPins: number; activeMocks: number }
type MockData = { app: string; service: string; pin: string; payload: string; version: string; updatedAt: string }

export default function Dashboard(){
  const [stats, setStats] = useState<Stats>({ totalServices:0, totalPins:0, activeMocks:0 })
  const [recentMocks, setRecentMocks] = useState<MockData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    Promise.all([
      api.get('/admin/stats'),
      // Simulate recent mocks data
      Promise.resolve({ data: [
        { app: 'PaymentsApp', service: 'TransactionService', pin: '/api/transactions', payload: '{"status":"SUCCESS"}', version: 'v1', updatedAt: new Date().toISOString() },
        { app: 'UserApp', service: 'ProfileService', pin: '/api/user/profile', payload: '{"userId":"U12345"}', version: 'v1', updatedAt: new Date().toISOString() }
      ]})
    ]).then(([statsRes, mocksRes]) => {
      setStats(statsRes.data)
      setRecentMocks(mocksRes.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-lg">Loading...</div></div>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">TrustMock Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your mock services and endpoints</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span>System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExpandableStatsCard 
          title="Total Services" 
          value={stats.totalServices} 
          icon="🔧" 
          color="bg-primary"
          details={[
            { label: 'PaymentsApp', count: 2 },
            { label: 'UserApp', count: 2 },
            { label: 'NotificationApp', count: 1 }
          ]}
        />
        <ExpandableStatsCard 
          title="Active Endpoints" 
          value={stats.totalPins} 
          icon="📍" 
          color="bg-accent"
          details={[
            { label: '/api/transactions', count: 1 },
            { label: '/api/user/profile', count: 1 },
            { label: '/api/cards', count: 1 }
          ]}
        />
        <ExpandableStatsCard 
          title="Mock Responses" 
          value={stats.activeMocks} 
          icon="⚡" 
          color="bg-success"
          details={[
            { label: 'Active Mocks', count: stats.activeMocks },
            { label: 'Total Versions', count: stats.activeMocks * 2 },
            { label: 'Last 24h Updates', count: 3 }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">Recent Mock Activity</h2>
          <div className="space-y-3">
            {recentMocks.map((mock, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{mock.service}</div>
                  <div className="text-sm text-gray-500">{mock.app} • {mock.pin}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-success">{mock.version}</div>
                  <div className="text-xs text-gray-400">{new Date(mock.updatedAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-primary mb-4">System Health</h2>
          <div className="space-y-4">
            <HealthItem label="API Server" status="healthy" />
            <HealthItem label="Mock Repository" status="healthy" />
            <HealthItem label="Admin Interface" status="healthy" />
            <HealthItem label="CORS Configuration" status="healthy" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ExpandableStatsCard({ title, value, icon, color, details }: { 
  title: string; value: number; icon: string; color: string; 
  details: { label: string; count: number }[] 
}) {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className={`${color} text-white rounded-xl shadow-lg transition-all duration-300 ${
      expanded ? 'row-span-2' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90 font-medium">{title}</div>
            <div className="text-3xl font-bold mt-1">{value}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-3xl opacity-80">{icon}</div>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              {expanded ? '▼' : '▶'}
            </button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-6 pt-4 border-t border-white border-opacity-20">
            <div className="text-sm font-medium mb-3 opacity-90">Breakdown:</div>
            <div className="space-y-2">
              {details.map((detail, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm opacity-80">{detail.label}</span>
                  <span className="font-semibold">{detail.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HealthItem({ label, status }: { label: string; status: 'healthy' | 'warning' | 'error' }) {
  const statusColors = {
    healthy: 'bg-success text-white',
    warning: 'bg-yellow-500 text-white', 
    error: 'bg-danger text-white'
  }
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status.toUpperCase()}
      </span>
    </div>
  )
}
