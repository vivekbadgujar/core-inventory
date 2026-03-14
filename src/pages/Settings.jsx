import { useState } from 'react'
import { User, Bell, Shield, Database, Palette } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  
  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ]

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@coreinventory.com',
    role: 'Administrator',
    warehouse: 'Main Warehouse'
  })

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newReceipts: true,
    deliveryUpdates: true,
    systemAlerts: false
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500">System</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-400">Manage your account settings and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 panel p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-slate-400 hover:bg-panelSoft hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 panel p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Full Name</label>
                  <input 
                    className="field" 
                    value={profile.name} 
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))} 
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Email Address</label>
                  <input 
                    className="field" 
                    type="email"
                    value={profile.email} 
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))} 
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Role</label>
                  <input className="field" value={profile.role} disabled />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Default Warehouse</label>
                  <select 
                    className="field" 
                    value={profile.warehouse}
                    onChange={(e) => setProfile(prev => ({ ...prev, warehouse: e.target.value }))}
                  >
                    <option>Main Warehouse</option>
                    <option>Secondary Warehouse</option>
                    <option>Distribution Center</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary">Save Profile</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-panelSoft">
                    <div>
                      <p className="font-medium text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-slate-400">
                        {key === 'lowStock' && 'Get notified when items are running low'}
                        {key === 'newReceipts' && 'Receive alerts for new inventory receipts'}
                        {key === 'deliveryUpdates' && 'Track delivery status changes'}
                        {key === 'systemAlerts' && 'Important system notifications'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-accent' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Security Settings</h3>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Current Password</label>
                  <input className="field" type="password" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">New Password</label>
                  <input className="field" type="password" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Confirm New Password</label>
                  <input className="field" type="password" />
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Data Management</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-panelSoft">
                  <h4 className="font-medium text-white mb-2">Export Data</h4>
                  <p className="text-sm text-slate-400 mb-4">Download your inventory data as CSV or Excel files.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary">Export CSV</button>
                    <button className="btn-secondary">Export Excel</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-panelSoft">
                  <h4 className="font-medium text-white mb-2">Backup & Restore</h4>
                  <p className="text-sm text-slate-400 mb-4">Create backups or restore from previous backups.</p>
                  <div className="flex gap-3">
                    <button className="btn-primary">Create Backup</button>
                    <button className="btn-secondary">Restore Backup</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-panelSoft">
                  <h4 className="font-medium text-white mb-2">Theme</h4>
                  <p className="text-sm text-slate-400 mb-4">Choose your preferred color theme.</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-3 rounded-lg border-2 border-accent bg-panel">Dark</button>
                    <button className="p-3 rounded-lg border border-line bg-panel">Light</button>
                    <button className="p-3 rounded-lg border border-line bg-panel">Auto</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
