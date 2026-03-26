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
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (index + 1) % tabs.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (index - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = tabs.length - 1
    } else {
      return
    }
    onChange(tabs[nextIndex].id)
    const btn = e.currentTarget.parentElement?.children[nextIndex] as HTMLElement | undefined
    btn?.focus()
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div role="tablist" aria-label="Secciones" className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
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