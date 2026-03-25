'use client'

type Tab = {
  id: string
  label: string
  description?: string
}

type AdminTabsProps = {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export default function AdminTabs({ tabs, activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                isActive
                  ? 'border-pink-200 bg-pink-50 text-pink-700'
                  : 'border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-slate-100'
              }`}
            >
              <p className="text-sm font-semibold">{tab.label}</p>
              {tab.description && (
                <p className="mt-1 text-xs text-slate-500">{tab.description}</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}