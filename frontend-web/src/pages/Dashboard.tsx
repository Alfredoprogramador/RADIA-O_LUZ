import { useQuery } from '@tanstack/react-query'
import { Users, FileText, Hammer, Wrench, DollarSign, TrendingUp, Sun, Zap } from 'lucide-react'
import api from '../services/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6']

const geracaoData = [
  { mes: 'Jan', geracao: 420, economia: 357 },
  { mes: 'Fev', geracao: 380, economia: 323 },
  { mes: 'Mar', geracao: 450, economia: 382 },
  { mes: 'Abr', geracao: 410, economia: 348 },
  { mes: 'Mai', geracao: 390, economia: 331 },
  { mes: 'Jun', geracao: 360, economia: 306 },
  { mes: 'Jul', geracao: 400, economia: 340 },
  { mes: 'Ago', geracao: 440, economia: 374 },
  { mes: 'Set', geracao: 470, economia: 399 },
  { mes: 'Out', geracao: 490, economia: 416 },
  { mes: 'Nov', geracao: 460, economia: 391 },
  { mes: 'Dez', geracao: 430, economia: 365 },
]

const funil = [
  { name: 'Novos Leads', value: 48 },
  { name: 'Qualificados', value: 32 },
  { name: 'Orçamento', value: 20 },
  { name: 'Negociação', value: 12 },
  { name: 'Fechados', value: 8 },
]

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  sub?: string
}

function StatCard({ title, value, icon, color, sub }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data: dashFinanceiro } = useQuery({
    queryKey: ['financeiro-dashboard'],
    queryFn: () => api.get('/financeiro/dashboard').then((r) => r.data),
  })

  const { data: funilData } = useQuery({
    queryKey: ['funil-vendas'],
    queryFn: () => api.get('/crm/funil').then((r) => r.data),
  })

  const { data: sla } = useQuery({
    queryKey: ['manutencao-sla'],
    queryFn: () => api.get('/manutencao/relatorio/sla').then((r) => r.data),
  })

  const receitaTotal = dashFinanceiro?.receitaTotal
    ? `R$ ${Number(dashFinanceiro.receitaTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : 'Carregando...'

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema RADIAÇÃO_LUZ</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receita Total"
          value={receitaTotal}
          icon={<DollarSign size={20} className="text-white" />}
          color="bg-green-500"
          sub="Pagamentos confirmados"
        />
        <StatCard
          title="Chamados Abertos"
          value={sla?.abertos ?? '—'}
          icon={<Wrench size={20} className="text-white" />}
          color="bg-orange-500"
          sub={`Tempo médio: ${sla?.tempoMedioResposta ?? '—'}h`}
        />
        <StatCard
          title="Leads no Funil"
          value={funilData ? Object.values(funilData as Record<string, number>).reduce((a, b) => a + b, 0) : '—'}
          icon={<Users size={20} className="text-white" />}
          color="bg-blue-500"
          sub="Todos os status"
        />
        <StatCard
          title="Inadimplência"
          value={
            dashFinanceiro?.inadimplencia
              ? `R$ ${Number(dashFinanceiro.inadimplencia).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : '—'
          }
          icon={<TrendingUp size={20} className="text-white" />}
          color="bg-red-500"
          sub="Pagamentos vencidos"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Geração e Economia Mensal (kWh / R$)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={geracaoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="geracao" stroke="#f97316" fill="#fed7aa" name="Geração (kWh)" />
              <Area type="monotone" dataKey="economia" stroke="#22c55e" fill="#bbf7d0" name="Economia (R$)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Funil de Vendas</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={funil} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Solar Summary */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Sun className="text-primary-500" size={24} />
          <h3 className="font-semibold text-gray-900">Resumo de Geração Solar</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Sistemas Ativos', value: '247', unit: '' },
            { label: 'Geração Total Hoje', value: '1.842', unit: 'kWh' },
            { label: 'CO₂ Evitado (mês)', value: '12.4', unit: 'ton' },
            { label: 'Economia Média/Mês', value: 'R$ 342', unit: '' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold text-primary-600">
                {item.value}
                <span className="text-sm text-gray-500 ml-1">{item.unit}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
