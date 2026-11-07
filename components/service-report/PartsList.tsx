import DynamicList from './DynamicList'
import FormField from './FormField'
import type { Part } from './types'

export default function PartsList({ items, update, add, remove }: { items: Part[]; update: (index: number, field: keyof Part, value: string) => void; add: () => void; remove: (index: number) => void }) {
  return <DynamicList items={items} addLabel="Add Part / Material" addItem={add} removeItem={remove} renderItem={(part, index) => (
    <div className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-3 md:items-end">
      <FormField label="Part / Material" value={part.name} onChange={(event) => update(index, 'name', event.target.value)} />
      <FormField label="Quantity" value={part.quantity} onChange={(event) => update(index, 'quantity', event.target.value)} />
      <FormField label="Remarks" value={part.remarks} onChange={(event) => update(index, 'remarks', event.target.value)} />
    </div>
  )} />
}