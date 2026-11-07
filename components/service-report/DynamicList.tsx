import { Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

type DynamicListProps<T> = {
  items: T[]
  addLabel: string
  addItem: () => void
  removeItem: (index: number) => void
  renderItem: (item: T, index: number, canRemove: boolean) => ReactNode
}

export default function DynamicList<T>({ items, addLabel, addItem, removeItem, renderItem }: DynamicListProps<T>) {
  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <div key={index} className="relative">
          {renderItem(item, index, items.length > 1)}
          {items.length > 1 && <button type="button" aria-label={`Remove item ${index + 1}`} onClick={() => removeItem(index)} className="absolute right-0 top-0 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
        </div>
      ))}
      <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 rounded-md border border-[#002B8B] px-3 py-2 text-xs font-semibold text-[#002B8B] hover:bg-[#eef5ff]"><Plus className="h-4 w-4" /> {addLabel}</button>
    </div>
  )
}