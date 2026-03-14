import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Table from '../components/Table'
import { deliveriesAPI } from '../services/api'

const Delivery = () => {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await deliveriesAPI.getAll()
        setDeliveries(data.deliveries || [])
        setLoading(false)
      } catch (error) {
        console.error('Deliveries fetch error:', error)
        setError('Failed to load deliveries')
        setLoading(false)
      }
    }

    fetchDeliveries()
  }, [])

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      await deliveriesAPI.updateStatus(deliveryId, newStatus)
      
      // Update local state
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === deliveryId 
            ? { ...delivery, status: newStatus }
            : delivery
        )
      )
    } catch (error) {
      console.error('Delivery status update error:', error)
      setError('Failed to update delivery status')
    }
  }

  const columns = [
    {
      key: 'reference',
      label: 'Reference',
      render: (row) => (
        <span className="font-mono text-purple-400 font-medium cursor-pointer">
          {row.reference}
        </span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => (
        <span className="text-white font-medium">{row.customer}</span>
      )
    },
    {
      key: 'scheduled_date',
      label: 'Scheduled Date',
      render: (row) => (
        <span className="text-slate-300">
          {row.scheduled_date ? new Date(row.scheduled_date).toLocaleDateString() : 'Not set'}
        </span>
      )
    },
    {
      key: 'item_count',
      label: 'Items',
      render: (row) => (
        <span className="text-slate-300">{row.item_count || 0}</span>
      )
    },
    {
      key: 'total_quantity',
      label: 'Total Qty',
      render: (row) => (
        <span className="text-slate-300">{row.total_quantity || 0}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const statusColors = {
          draft: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
          ready: 'border-green-500/30 bg-green-500/10 text-green-300',
          done: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
          cancelled: 'border-red-500/30 bg-red-500/10 text-red-300'
        }
        
        return (
          <select
            value={row.status}
            onChange={(e) => updateDeliveryStatus(row.id, e.target.value)}
            className={`rounded-full border px-3 py-1 text-xs font-bold cursor-pointer field w-24 text-center ${statusColors[row.status] || statusColors.draft}`}
          >
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="done">Done</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )
      }
    },
    {
      key: 'created_by_name',
      label: 'Created By',
      render: (row) => (
        <span className="text-slate-400 text-sm">{row.created_by_name || 'System'}</span>
      )
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Deliveries</h2>
            <p className="text-slate-400">Manage outgoing shipments and customer orders.</p>
          </div>
          <button 
            onClick={() => navigate('/delivery/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accentSoft rounded-xl transition-all text-sm font-semibold shadow-lg shadow-accent/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Delivery
          </button>
        </div>
        
        <div className="panel">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-slate-400">Loading deliveries...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Deliveries</h2>
            <p className="text-slate-400">Manage outgoing shipments and customer orders.</p>
          </div>
          <button 
            onClick={() => navigate('/delivery/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accentSoft rounded-xl transition-all text-sm font-semibold shadow-lg shadow-accent/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Delivery
          </button>
        </div>
        
        <div className="panel">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-red-400">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Deliveries</h2>
          <p className="text-slate-400">Manage outgoing shipments and customer orders.</p>
        </div>
        <button 
          onClick={() => navigate('/delivery/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accentSoft rounded-xl transition-all text-sm font-semibold shadow-lg shadow-accent/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Delivery
        </button>
      </div>
      
      <div className="panel">
        <Table columns={columns} data={deliveries} />
      </div>
    </div>
  )
}

export default Delivery  
