'use client'

interface FiltersPanelProps {
  groups: string[]
  subgroups: string[]
  selectedGroup: string
  selectedSubgroup: string
  onSelectGroup: (group: string) => void
  onSelectSubgroup: (subgroup: string) => void
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-md font-condensed font-bold uppercase tracking-[0.06em] transition-all duration-200"
      style={{
        fontSize: '0.82rem',
        background: active ? 'rgba(240,224,64,0.14)' : 'transparent',
        color: active ? 'var(--yellow)' : 'var(--gray2)',
        border: `1px solid ${active ? 'rgba(240,224,64,0.3)' : 'rgba(255,255,255,0.06)'}`,
        marginBottom: 6,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

export default function FiltersPanel({
  groups,
  subgroups,
  selectedGroup,
  selectedSubgroup,
  onSelectGroup,
  onSelectSubgroup,
}: FiltersPanelProps) {
  return (
    <aside
      className="p-6 border-r"
      style={{ background: 'var(--dark2)', borderColor: 'var(--dark3)', width: 260 }}
    >
      <div className="mb-6">
        <div
          className="font-condensed font-extrabold uppercase tracking-[0.12em] mb-3"
          style={{ fontSize: '0.85rem', color: 'var(--gray)' }}
        >
          GRUPOS
        </div>
        {groups.map((group) => (
          <FilterButton
            key={group}
            label={group}
            active={selectedGroup === group}
            onClick={() => onSelectGroup(group)}
          />
        ))}
      </div>

      <div>
        <div
          className="font-condensed font-extrabold uppercase tracking-[0.12em] mb-3"
          style={{ fontSize: '0.85rem', color: 'var(--gray)' }}
        >
          SUBGRUPOS
        </div>
        {subgroups.map((subgroup) => (
          <FilterButton
            key={subgroup}
            label={subgroup}
            active={selectedSubgroup === subgroup}
            onClick={() => onSelectSubgroup(subgroup)}
          />
        ))}
      </div>
    </aside>
  )
}
