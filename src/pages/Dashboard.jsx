import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { receiptsAPI, deliveriesAPI, stockAPI } from '../services/api'

export default function Dashboard() {
  const [data, setData] = useState({
    receiptsCount: 0,
    deliveriesCount: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    lowStockAlerts: 0,
    loading: true,
    error: null
  })

  const fetchDashboardData = async () => {
    try {
      const [receipts, deliveries, lowStock] = await Promise.all([
        receiptsAPI.getAll({ status: 'draft' }),
        deliveriesAPI.getAll({ status: 'draft' }),
        stockAPI.getLowStockAlerts()
      ])

      const [allReceipts, allDeliveries] = await Promise.all([
        receiptsAPI.getAll(),
        deliveriesAPI.getAll()
      ])

      setData({
        receiptsCount: allReceipts.receipts?.length || 0,
        deliveriesCount: allDeliveries.deliveries?.length || 0,
        pendingReceipts: receipts.receipts?.length || 0,
        pendingDeliveries: deliveries.deliveries?.length || 0,
        lowStockAlerts: lowStock.count || 0,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard data'
      }))
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const summaryCards = [
    {
      title: 'Receipts',
      value: data.receiptsCount,
      description: 'Total inbound receipts in the system.',
      actionLabel: 'Open Receipts',
      actionTo: '/receipts',
    },
    {
      title: 'Deliveries',
      value: data.deliveriesCount,
      description: 'Total outbound deliveries in the system.',
      actionLabel: 'Open Delivery',
      actionTo: '/delivery',
    },
  ]

  if (data.loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-slate-400">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Dashboard</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Operations overview</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Monitor daily receipts and deliveries from one place with an ERP-inspired command center.
          </p>
        </div>
        <div className="panel p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Failed to load data</h3>
          <p className="text-slate-400 mb-4">{data.error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accentSoft transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Dashboard</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Operations overview</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Monitor daily receipts and deliveries from one place with an ERP-inspired command center.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {summaryCards.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="panel p-6">
          <h3 className="section-title">Today&apos;s movement</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Pending Receipts', value: data.pendingReceipts.toString() },
              { label: 'Pending Deliveries', value: data.pendingDeliveries.toString() },
              { label: 'Low Stock Alerts', value: data.lowStockAlerts.toString() },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-line bg-panelSoft p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="section-title">Quick notes</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="rounded-xl border border-line bg-panelSoft p-4">
              {data.pendingReceipts > 0 ? `${data.pendingReceipts} receipts pending validation.` : 'No pending receipts.'}
            </li>
            <li className="rounded-xl border border-line bg-panelSoft p-4">
              {data.pendingDeliveries > 0 ? `${data.pendingDeliveries} deliveries ready for dispatch.` : 'No pending deliveries.'}
            </li>
            <li className="rounded-xl border border-line bg-panelSoft p-4">
              {data.lowStockAlerts > 0 ? `${data.lowStockAlerts} items need restocking.` : 'All stock levels are adequate.'}
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
