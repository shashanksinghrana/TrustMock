import { useState } from 'react'
import { api } from '../service/api'

type Props = {
  app: string
  service: string
  pin: string
  initialPayload?: string
  onSave: (payload: string) => void
  onClose: () => void
}

export default function MockEditor({ app, service, pin, initialPayload = '', onSave, onClose }: Props) {
  const [payload, setPayload] = useState(initialPayload || JSON.stringify({
    status: 'SUCCESS',
    message: 'Mock response',
    data: {},
    timestamp: new Date().toISOString()
  }, null, 2))
  
  const [validationResult, setValidationResult] = useState<any>(null)
  const [sanityResult, setSanityResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const validatePayload = async () => {
    setLoading(true)
    try {
      const response = await api.post('/mock/validate', { app, service, pin, payload })
      setValidationResult(response.data)
    } catch (error) {
      setValidationResult({ valid: false, message: 'Validation failed' })
    } finally {
      setLoading(false)
    }
  }

  const runSanityCheck = async () => {
    setLoading(true)
    try {
      const response = await api.post('/mock/sanity-check', { app, service, pin, payload })
      setSanityResult(response.data)
    } catch (error) {
      setSanityResult({ status: 'error', message: 'Sanity check failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (validationResult?.valid) {
      onSave(payload)
    } else {
      alert('Please validate the payload first')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-primary">Mock Editor</h2>
            <p className="text-gray-600">{app} → {service} → {pin}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mock Payload (JSON)
              </label>
              <textarea
                className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="Enter your mock JSON payload..."
              />
              
              <div className="flex space-x-3 mt-4">
                <button 
                  className="btn-secondary" 
                  onClick={validatePayload}
                  disabled={loading}
                >
                  🔍 Validate JSON
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={runSanityCheck}
                  disabled={loading}
                >
                  🧪 Sanity Check
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {validationResult && (
                <div className={`p-4 rounded-lg ${
                  validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className={validationResult.valid ? 'text-green-600' : 'text-red-600'}>
                      {validationResult.valid ? '✅' : '❌'}
                    </span>
                    <span className="font-medium">Validation Result</span>
                  </div>
                  <p className="text-sm mt-1">{validationResult.message}</p>
                </div>
              )}

              {sanityResult && (
                <div className={`p-4 rounded-lg ${
                  sanityResult.status === 'success' ? 'bg-blue-50 border border-blue-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span>🧪</span>
                    <span className="font-medium">Sanity Check Results</span>
                  </div>
                  <p className="text-sm mt-1">{sanityResult.message}</p>
                  {sanityResult.recommendations && (
                    <ul className="text-sm mt-2 space-y-1">
                      {sanityResult.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="text-green-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Preview</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-32">
                  {JSON.stringify(JSON.parse(payload || '{}'), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn bg-success hover:bg-green-600" 
            onClick={handleSave}
            disabled={!validationResult?.valid}
          >
            💾 Save Mock
          </button>
        </div>
      </div>
    </div>
  )
}