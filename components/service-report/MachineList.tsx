import DynamicList from './DynamicList'
import FormField from './FormField'
import type { Machine } from './types'

const fields: Array<[keyof Machine, string]> = [
  ['model', 'Machine / Model Name & No.'], ['serial', 'Serial Number'], ['issue', 'Issue / Complaint'],
  ['capacity', 'Capacity'], ['type', 'Machine Type'], ['location', 'Installation / Location'],
]

export default function MachineList({ items, update, add, remove }: { items: Machine[]; update: (index: number, field: keyof Machine, value: string) => void; add: () => void; remove: (index: number) => void }) {
  return <DynamicList items={items} addLabel="Add Machine" addItem={add} removeItem={remove} renderItem={(machine, index, canRemove) => (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-4 text-sm font-bold text-slate-700">Machine {index + 1}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{fields.map(([field, label]) => <FormField key={field} label={label} value={machine[field]} onChange={(event) => update(index, field, event.target.value)} className={canRemove ? 'pr-8' : ''} />)}</div>
    </div>
  )} />
}