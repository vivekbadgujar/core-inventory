import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { deliveriesAPI, productsAPI, stockAPI } from '../services/api'

const NewDelivery = () => {
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    customer: '',
    scheduled_date: '',
    items: [
      { product_id: '', quantity: 1 }
    ]
  })
  
  const [products, setProducts] = useState([])
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, stockData] = await Promise.all([
          productsAPI.getAll(),
          stockAPI.getAll()
        ])
        
        setProducts(productsData.products || [])
        setStock(stockData.stock || [])
      } catch (error) {
        console.error('Data fetch error:', error)
        setError('Failed to load data')
      }
    }

    fetchData()
  }, [])

  const getAvailableStock = (productId) => {
    const stockRecords = stock.filter(s => s.product_id === parseInt(productId))
    return stockRecords.reduce((total, record) => total + record.quantity, 0)
  }

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }]
    }))
  }

  const removeItem = (index) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!form.customer) {
        throw new Error('Customer is required')
      }

      if (form.items.some(item => !item.product_id || item.quantity < 1)) {
        throw new Error('All items must have a product and quantity of at least 1')
      }

      // Check stock availability
      for (const item of form.items) {
        const availableStock = getAvailableStock(item.product_id)
        if (availableStock < item.quantity) {
          const product = products.find(p => p.id === item.product_id)
          throw new Error(`Insufficient stock for ${product?.name}. Available: ${availableStock}, Required: ${item.quantity}`)
        }
      }

      await deliveriesAPI.create(form)
      setSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/delivery')
      }, 2000)
      
    } catch (error) {
      console.error('Delivery creation error:', error)
      setError(error.message || 'Failed to create delivery')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/delivery')}
            className="p-2 hover:bg-panelSoft rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight">Create New Delivery</h2>
            <p className="text-slate-400">Fill in details to dispatch stock.</p>
          </div>
        </div>

        <div className="panel p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Delivery Created Successfully!</h3>
          <p className="text-slate-400 mb-4">Redirecting to deliveries list...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/delivery')}
          className="p-2 hover:bg-panelSoft rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Create New Delivery</h2>
          <p className="text-slate-400">Fill in details to dispatch stock.</p>
        </div>
      </div>

      <div className="panel p-8">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Customer *</label>
              <input 
                type="text" 
                value={form.customer}
                onChange={(e) => setForm(prev => ({ ...prev, customer: e.target.value }))}
                className="field"
                placeholder="Enter customer name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Scheduled Date</label>
              <input 
                type="date" 
                value={form.scheduled_date}
                onChange={(e) => setForm(prev => ({ ...prev, scheduled_date: e.target.value }))}
                className="field"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Delivery Items</h3>
              <button 
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {form.items.map((item, index) => {
              const availableStock = item.product_id ? getAvailableStock(item.product_id) : 0
              const product = products.find(p => p.id === item.product_id)
              
              return (
                <div key={index} className="grid gap-4 md:grid-cols-4 p-4 rounded-xl bg-panelSoft">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Product *</label>
                    <select 
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      className="field"
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((product) => {
                        const stock = getAvailableStock(product.id)
                        return (
                          <option 
                            key={product.id} 
                            value={product.id}
                            disabled={stock === 0}
                          >
                            {product.name} ({product.sku}) - {stock} available
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Quantity *</label>
                    <input 
                      type="number" 
                      min="1"
                      max={availableStock}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="field"
                      required
                    />
                    {item.product_id && (
                      <p className="text-xs text-slate-400">
                        Available: {availableStock} {product?.unit}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Unit</label>
                    <div className="text-slate-300 pt-2">
                      {product?.unit || 'pcs'}
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    {form.items.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-line">
            <button 
              type="button"
              onClick={() => navigate('/delivery')}
              className="px-6 py-2.5 border border-line bg-panelSoft text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl hover:bg-accentSoft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Delivery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewDelivery
