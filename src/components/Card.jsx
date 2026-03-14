import { Link } from 'react-router-dom'

export default function Card({ title, value, description, actionLabel, actionTo }) {
  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
          <p className="mt-3 text-sm text-slate-400">{description}</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-accent/15" />
      </div>
      <Link to={actionTo} className="btn-primary mt-6">
        {actionLabel}
      </Link>
    </div>
  )
}
