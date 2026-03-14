import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Table from '../components/Table'
import { receiptsAPI } from '../services/api'

export default function Receipts() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await receiptsAPI.getAll()
        setReceipts(data.receipts || [])
        setLoading(false)
      } catch (error) {
        console.error('Receipts fetch error:', error)
        setError('Failed to load receipts')
        setLoading(false)
      }
    }

    fetchReceipts()
  }, [])

  const updateReceiptStatus = async (receiptId, newStatus) => {
    try {
      await receiptsAPI.updateStatus(receiptId, newStatus)
      
      // Update local state
      setReceipts(prev => 
        prev.map(receipt => 
          receipt.id === receiptId 
            ? { ...receipt, status: newStatus }
            : receipt
        )
      )
    } catch (error) {
      console.error('Receipt status update error:', error)
      setError('Failed to update receipt status')
    }
  }

  const columns = [
    {
      key: 'reference',
      label: 'Reference',
      render: (row) => (
        <span className="font-mono text-blue-400 font-medium">{row.reference}</span>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => (
        <span className="text-white font-medium">{row.supplier}</span>
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
          ready: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
          done: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
          cancelled: 'border-red-500/30 bg-red-500/10 text-red-300'
        }
        
        return (
          <select
            value={row.status}
            onChange={(e) => updateReceiptStatus(row.id, e.target.value)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer field w-24 text-center ${statusColors[row.status] || statusColors.draft}`}
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Operations</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Receipts</h2>
            <p className="mt-2 text-sm text-slate-400">Track inbound inventory transfers and prepare them for validation.</p>
          </div>
          <Link to="/receipts/new" className="btn-primary">
            New Receipt
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-slate-400">Loading receipts...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Operations</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Receipts</h2>
            <p className="mt-2 text-sm text-slate-400">Track inbound inventory transfers and prepare them for validation.</p>
          </div>
          <Link to="/receipts/new" className="btn-primary">
            New Receipt
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Operations</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Receipts</h2>
          <p className="mt-2 text-sm text-slate-400">Track inbound inventory transfers and prepare them for validation.</p>
        </div>
        <Link to="/receipts/new" className="btn-primary">
          New Receipt
        </Link>
      </div>

      <div className="panel p-5">
        <Table columns={columns} data={receipts} />
      </div>
    </div>
  )
}
