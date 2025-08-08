import { useState, useEffect } from 'react'
import { api } from '../service/api'
import ServiceRow from '../components/ServiceRow'
import MockEditor from '../components/MockEditor'

type Row = { app: string; service: string; pin: string; enabled: boolean; lastUpdated?: string }
type NewMock = { app: string; service: string; pin: string; payload: string }

export default function Settings(){
  const [rows, setRows] = useState<Row[]>([
    { app:'PaymentsApp', service:'TransactionService', pin:'/api/transactions', enabled:false, lastUpdated: new Date().toISOString() },
    { app:'PaymentsApp', service:'CardService', pin:'/api/cards', enabled:false, lastUpdated: new Date().toISOString() },
    { app:'UserApp', service:'ProfileService', pin:'/api/user/profile', enabled:true, lastUpdated: new Date().toISOString() },
    { app:'UserApp', service:'AuthService', pin:'/api/auth/login', enabled:false, lastUpdated: new Date().toISOString() }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMock, setNewMock] = useState<NewMock>({ app: '', service: '', pin: '', payload: '' })
  const [loading, setLoading] = useState(false)
  const [editingMock, setEditingMock] = useState<{index: number, mock: Row} | null>(null)

  const toggle = async (i: number, enabled: boolean) => {
    const r = rows[i]
    setRows(prev => prev.map((x, idx)=> idx===i? {...x, enabled, lastUpdated: new Date().toISOString()}: x))
    try {
      await api.post('/admin/toggle', { app: r.app, service: r.service, enabled })
    } catch (error) {
      console.error('Toggle failed:', error)
      // Revert on error
      setRows(prev => prev.map((x, idx)=> idx===i? {...x, enabled: !enabled}: x))
    }
  }

  const openMockEditor = (i: number) => {
    setEditingMock({ index: i, mock: rows[i] })
  }

  const saveMockFromEditor = async (payload: string) => {
    if (!editingMock) return
    
    const { index, mock } = editingMock
    setLoading(true)
    try {
      await api.post('/mock/upsert', { 
        app: mock.app, 
        service: mock.service, 
        pin: mock.pin, 
        payload, 
        version: 'v1' 
      })
      setRows(prev => prev.map((x, idx)=> idx===index? {...x, lastUpdated: new Date().toISOString()}: x))
      setEditingMock(null)
      alert('✓ Mock response saved successfully!')
    } catch (error) {
      console.error('Save failed:', error)
      alert('⚠️ Failed to save mock response')
    } finally {
      setLoading(false)
    }
  }

  const saveMock = async (i: number) => {
    openMockEditor(i)
  }

  const addNewMock = async () => {
    if (!newMock.app || !newMock.service || !newMock.pin) {
      alert('Please fill all required fields')
      return
    }
    
    setLoading(true)
    try {
      const payload = newMock.payload || JSON.stringify({ status: 'SUCCESS', message: 'Default mock response' })
      await api.post('/mock/upsert', { ...newMock, payload, version: 'v1' })
      
      setRows(prev => [...prev, { 
        ...newMock, 
        enabled: false, 
        lastUpdated: new Date().toISOString() 
      }])
      
      setNewMock({ app: '', service: '', pin: '', payload: '' })
      setShowAddForm(false)
      alert('✓ New mock added successfully!')
    } catch (error) {
      console.error('Add failed:', error)
      alert('⚠️ Failed to add new mock')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Mock Management</h1>
          <p className="text-gray-600 mt-1">Configure and manage your service mocks</p>
        </div>
        <button 
          className="btn bg-success hover:bg-green-600 flex items-center space-x-2"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <span>+</span>
          <span>Add New Mock</span>
        </button>
      </div>

      {showAddForm && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-primary mb-4">Add New Mock Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              className="input" 
              placeholder="App Name (e.g., PaymentsApp)"
              value={newMock.app}
              onChange={e => setNewMock(prev => ({...prev, app: e.target.value}))}
            />
            <input 
              className="input" 
              placeholder="Service Name (e.g., TransactionService)"
              value={newMock.service}
              onChange={e => setNewMock(prev => ({...prev, service: e.target.value}))}
            />
            <input 
              className="input" 
              placeholder="Endpoint PIN (e.g., /api/transactions)"
              value={newMock.pin}
              onChange={e => setNewMock(prev => ({...prev, pin: e.target.value}))}
            />
            <textarea 
              className="input" 
              placeholder="Mock Payload (JSON)"
              value={newMock.payload}
              onChange={e => setNewMock(prev => ({...prev, payload: e.target.value}))}
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button className="btn" onClick={addNewMock} disabled={loading}>
              {loading ? 'Adding...' : 'Add Mock'}
            </button>
            <button className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Service Mock Toggles</h2>
          <div className="text-sm text-gray-500">{rows.length} services configured</div>
        </div>
        
        <div className="space-y-3">
          {rows.map((r, i)=>(
            <ServiceRow key={i}
              app={r.app} service={r.service} pin={r.pin} enabled={r.enabled}
              lastUpdated={r.lastUpdated}
              onToggle={(v)=>toggle(i, v)} onSaveMock={()=>saveMock(i)}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {editingMock && (
        <MockEditor
          app={editingMock.mock.app}
          service={editingMock.mock.service}
          pin={editingMock.mock.pin}
          onSave={saveMockFromEditor}
          onClose={() => setEditingMock(null)}
        />
      )}
    </div>
  )
}
