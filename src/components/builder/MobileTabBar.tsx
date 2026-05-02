interface MobileTabBarProps {
  activeTab: 'shelf' | 'canvas' | 'layers'
  onTabChange: (tab: 'shelf' | 'canvas' | 'layers') => void
  layerCount: number
}

export default function MobileTabBar({ activeTab, onTabChange, layerCount }: MobileTabBarProps) {
  const tabs = [
    { id: 'shelf' as const, label: 'Shelf', emoji: '🧺' },
    { id: 'canvas' as const, label: 'Canvas', emoji: '🎂' },
    { id: 'layers' as const, label: 'Layers', emoji: '📋', badge: layerCount },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-primary-light/30 flex md:hidden pb-safe">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 relative transition-colors duration-200
            ${activeTab === tab.id ? 'text-primary-dark' : 'text-espresso-light/50'}`}
        >
          <span className="text-xl leading-none">{tab.emoji}</span>
          <span className="font-body text-[10px] font-medium">{tab.label}</span>
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className="absolute top-2 right-[calc(50%-12px)] w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {tab.badge}
            </span>
          )}
          {activeTab === tab.id && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-dark rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
