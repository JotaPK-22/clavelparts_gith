'use client'

interface FilterOption {
  label: string
  checked: boolean
}

interface FilterGroup {
  title: string
  options: FilterOption[]
}

const defaultFilters: FilterGroup[] = [
  {
    title: 'CATEGORÍA',
    options: [
      { label: 'Frenos', checked: true },
      { label: 'Filtros', checked: false },
      { label: 'Amortiguación', checked: false },
      { label: 'Motor', checked: false },
      { label: 'Embrague', checked: false },
      { label: 'Suspensión', checked: false },
      { label: 'Sistema eléctrico', checked: false },
    ],
  },
  {
    title: 'MARCA',
    options: [
      { label: 'Brembo', checked: true },
      { label: 'Bosch', checked: true },
      { label: 'Sachs', checked: false },
      { label: 'Valeo', checked: false },
      { label: 'Febi', checked: false },
      { label: 'TRW', checked: false },
      { label: 'Mahle', checked: false },
    ],
  },
  {
    title: 'TIPO',
    options: [
      { label: 'Original OEM', checked: true },
      { label: 'Aftermarket', checked: true },
      { label: 'New Old Stock', checked: false },
    ],
  },
]

export default function FiltersPanel() {
  return (
    <aside
      className="p-6 border-r"
      style={{ background: 'var(--dark2)', borderColor: 'var(--dark3)', width: 240 }}
    >
      {defaultFilters.map((group) => (
        <div key={group.title} className="mb-2">
          <div
            className="font-condensed font-extrabold uppercase tracking-[0.12em] mb-3 mt-5 first:mt-0"
            style={{ fontSize: '0.85rem', color: 'var(--gray)' }}
          >
            {group.title}
          </div>
          {group.options.map((opt) => (
            <label
              key={opt.label}
              className="flex items-center gap-2 py-[0.35rem] cursor-pointer transition-colors duration-200"
              style={{ fontSize: '0.88rem', color: 'var(--gray2)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray2)')}
            >
              <input
                type="checkbox"
                defaultChecked={opt.checked}
                style={{ accentColor: 'var(--yellow)' }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      ))}
    </aside>
  )
}
