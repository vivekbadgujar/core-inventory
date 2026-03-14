import { useState } from 'react'

export default function Warehouse() {
  const [form, setForm] = useState({
    name: 'Main Warehouse',
    code: 'MWH',
    address: 'Sector 21, Pune Logistics Park',
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Warehouse</h2>
        <p className="mt-2 text-sm text-slate-400">Maintain your primary warehouse identity and operational address.</p>
      </div>

      <div className="panel max-w-3xl p-6">
        <form className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Warehouse Name</label>
            <input className="field" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Short Code</label>
            <input className="field" value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Address</label>
            <textarea
              rows="4"
              className="field"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="btn-primary">Save Warehouse</button>
          </div>
        </form>
      </div>
    </div>
  )
}
