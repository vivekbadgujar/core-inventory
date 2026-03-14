import { useState } from 'react'

const warehouses = ['Main Warehouse', 'Overflow Storage', 'Returns Hub']

export default function Location() {
  const [form, setForm] = useState({
    name: 'Aisle 01 - Rack B',
    code: 'A1RB',
    warehouse: warehouses[0],
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Location</h2>
        <p className="mt-2 text-sm text-slate-400">Define storage locations and associate them with the right warehouse.</p>
      </div>

      <div className="panel max-w-3xl p-6">
        <form className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Location Name</label>
            <input className="field" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Short Code</label>
            <input className="field" value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Warehouse</label>
            <select className="field" value={form.warehouse} onChange={(event) => setForm((prev) => ({ ...prev, warehouse: event.target.value }))}>
              {warehouses.map((warehouse) => (
                <option key={warehouse}>{warehouse}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" className="btn-primary">Save Location</button>
          </div>
        </form>
      </div>
    </div>
  )
}
