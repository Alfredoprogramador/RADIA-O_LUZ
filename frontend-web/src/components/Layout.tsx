import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Zap,
  FileText,
  FolderKanban,
  Hammer,
  Wrench,
  DollarSign,
  Sun,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

interface NavItem {
  label: string
  path?: string
  icon: React.ReactNode
  children?: { label: string; path: string }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  {
    label: 'CRM',
    icon: <Users size={18} />,
    children: [
      { label: 'Clientes', path: '/crm/clientes' },
      { label: 'Leads / Funil', path: '/crm/leads' },
    ],
  },
  {
    label: 'Vendas',
    icon: <Zap size={18} />,
    children: [
      { label: 'Simulações', path: '/vendas/simulacoes' },
      { label: 'Contratos', path: '/vendas/contratos' },
    ],
  },
  { label: 'Projetos Técnicos', path: '/projetos', icon: <FolderKanban size={18} /> },
  { label: 'Instalação', path: '/instalacao', icon: <Hammer size={18} /> },
  { label: 'Manutenção', path: '/manutencao', icon: <Wrench size={18} /> },
  { label: 'Financeiro', path: '/financeiro', icon: <DollarSign size={18} /> },
]

function NavGroup({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)

  if (!item.children) {
    return (
      <NavLink
        to={item.path!}
        className={({ isActive }) =>
          clsx(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-gray-100',
          )
        }
      >
        {item.icon}
        {item.label}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-3">
          {item.icon}
          {item.label}
        </span>
        <ChevronDown size={14} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="ml-7 mt-1 space-y-1">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                clsx(
                  'block px-3 py-1.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sun className="text-primary-500" size={28} />
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">RADIAÇÃO_LUZ</h1>
              <p className="text-xs text-gray-500">Gestão Solar</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavGroup key={item.label} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">© 2024 RADIAÇÃO_LUZ</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
