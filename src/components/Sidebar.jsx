import { NavLink } from 'react-router-dom'

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Stock', path: '/stock' },
  { name: 'Warehouse', path: '/warehouse' },
  { name: 'Location', path: '/location' },
  { name: 'Receipts', path: '/receipts' },
  { name: 'Delivery', path: '/delivery' },
  { name: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-line/80 bg-slate-950/60 p-6 lg:block">
      <div className="panel flex h-full flex-col p-5">
        <div className="border-b border-line pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-xl font-bold text-accent">
            CI
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">CORE</h2>
          <p className="mt-1 text-sm text-slate-400">INVENTORY</p>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-slate-300 hover:bg-panelSoft hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-2xl border border-line bg-panelSoft p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Environment</p>
          <p className="mt-2 text-sm text-slate-200">Hackathon demo mode with seeded data and responsive dashboards.</p>
        </div>
      </div>
    </aside>
  )
}
