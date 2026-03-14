import { useState, useEffect } from 'react'
import Table from '../components/Table'
import { stockAPI } from '../services/api'

export default function Stock() {
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await stockAPI.getAll()
        setStock(data.stock || [])
        setLoading(false)
      } catch (error) {
        console.error('Stock fetch error:', error)
        setError('Failed to load stock data')
        setLoading(false)
      }
    }

    fetchStock()
  }, [])

  const updateStockQuantity = async (stockId, newQuantity) => {
    try {
      console.log('Updating stock:', { stockId, newQuantity });
      
      const result = await stockAPI.update(stockId, parseInt(newQuantity), 'Manual adjustment');
      console.log('Stock update result:', result);
      
      // Update local state
      setStock(prev => 
        prev.map(item => 
          item.id === stockId 
            ? { ...item, quantity: parseInt(newQuantity) }
            : item
        )
      );
      
      // Show success message
      setError(null);
      setSuccess('Stock updated successfully!');
      setTimeout(() => setSuccess(null), 3000); // Clear after 3 seconds
      console.log('Stock updated successfully');
    } catch (error) {
      console.error('Stock update error:', error);
      setError(`Failed to update stock: ${error.message || error}`);
      setSuccess(null);
    }
  }

  const handleQuantityChange = (stockId, newQuantity) => {
    // Update local state immediately for better UX
    setStock(prev => 
      prev.map(item => 
        item.id === stockId 
          ? { ...item, quantity: parseInt(newQuantity) || 0 }
          : item
      )
    );
  }

  const handleQuantityBlur = (stockId, newQuantity) => {
    // Only update if quantity is valid and different
    const quantity = parseInt(newQuantity);
    if (!isNaN(quantity) && quantity >= 0) {
      updateStockQuantity(stockId, quantity);
    }
  }

  const columns = [
    {
      key: 'product_name',
      label: 'Product',
      render: (row) => (
        <div>
          <div className="font-medium text-white">{row.product_name}</div>
          <div className="text-sm text-slate-400">{row.sku}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <span className="px-2 py-1 rounded-lg bg-panelSoft text-slate-300 text-sm">
          {row.category || 'N/A'}
        </span>
      )
    },
    {
      key: 'warehouse_name',
      label: 'Warehouse',
      render: (row) => (
        <div>
          <div className="font-medium text-white">{row.warehouse_name}</div>
          <div className="text-sm text-slate-400">{row.warehouse_code}</div>
        </div>
      )
    },
    {
      key: 'location_name',
      label: 'Location',
      render: (row) => (
        <div className="text-slate-300">{row.location_name}</div>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            className="field w-24 text-center"
            value={row.quantity}
            onChange={(e) => handleQuantityChange(row.id, e.target.value)}
            onBlur={(e) => handleQuantityBlur(row.id, e.target.value)}
          />
          <span className="text-sm text-slate-400">{row.unit}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isLowStock = row.quantity <= 10;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isLowStock 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
              : 'bg-green-500/10 text-green-500 border border-green-500/20'
          }`}>
            {isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        )
      }
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Products</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Stock</h2>
          <p className="mt-2 text-sm text-slate-400">Real-time inventory levels across all locations.</p>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-slate-400">Loading stock data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Products</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Stock</h2>
          <p className="mt-2 text-sm text-slate-400">Real-time inventory levels across all locations.</p>
        </div>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Products</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Stock</h2>
        <p className="mt-2 text-sm text-slate-400">Real-time inventory levels across all locations. Edit quantities to make adjustments.</p>
      </div>

      {success && (
        <div className="panel p-4 bg-green-500/20 border border-green-500/50">
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="panel p-4 bg-red-500/20 border border-red-500/50">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="panel p-5">
        <Table columns={columns} data={stock} />
      </div>
    </div>
  )
}
