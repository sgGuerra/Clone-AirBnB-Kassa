import {
  HomeIcon,
  OfficeBuildingIcon,
  LibraryIcon,
  ShoppingBagIcon,
  CashIcon,
  SparklesIcon,
  FireIcon,
  GlobeAltIcon,
} from '@heroicons/react/outline'

const CATEGORIES = [
  { key: 'populares', label: 'Populares', Icon: FireIcon },
  { key: 'destacados', label: 'Destacados', Icon: SparklesIcon },
  { key: 'urbano', label: 'Urbano', Icon: OfficeBuildingIcon },
  { key: 'centro', label: 'Centro', Icon: ShoppingBagIcon },
  { key: 'playa', label: 'Playa', Icon: GlobeAltIcon },
  { key: 'casa', label: 'Casas', Icon: HomeIcon },
  { key: 'departamento', label: 'Departamentos', Icon: OfficeBuildingIcon },
  { key: 'histórico', label: 'Histórico', Icon: LibraryIcon },
  { key: 'oferta', label: 'Ofertas', Icon: CashIcon },
]

function CategoryButton({ active, onClick, Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition
        ${active ? 'bg-kassa-primary text-white border-kassa-primary shadow-soft' : 'bg-white/70 backdrop-blur-md text-gray-700 border-white/50 hover:bg-white/80'}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

const CategoryBar = ({ selectedCategory, onSelect }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
        <CategoryButton
          active={!selectedCategory}
          onClick={() => onSelect(null)}
          Icon={GlobeAltIcon}
          label="Todas"
        />
        {CATEGORIES.map(({ key, label, Icon }) => (
          <CategoryButton
            key={key}
            active={selectedCategory === key}
            onClick={() => onSelect(selectedCategory === key ? null : key)}
            Icon={Icon}
            label={label}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryBar


