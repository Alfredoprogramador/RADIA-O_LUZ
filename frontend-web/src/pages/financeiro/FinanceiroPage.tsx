import { useQuery } from '@tanstack/react-query'
import { DollarSign, TrendingUp, AlertTriangle, Users } from 'lucide-react'
import api from '../../services/api'
import { clsx } from 'clsx'

const STATUS_PAGAMENTO: Record<string, { label: string; css: string }> = {
  pendente: { label: 'Pendente', css: 'badge-yellow' },
  pago: { label: 'Pago', css: 'badge-green' },
  vencido: { label: 'Vencido', css: 'badge-red' },
  cancelado: { label: 'Cancelado', css: 'badge-gray' },
}

interface Pagamento {
  id: string
  parcela: number
  valor: number
  dataVencimento: string
  status: string
  metodo: string
}

interface Dashboard {
  receitaTotal: number
  receitaPendente: number
  inadimplencia: number
  comissoesPendentes: number
}

export default function FinanceiroPage() {
  const { data: dashboard } = useQuery<Dashboard>({
    queryKey: ['financeiro-dashboard'],
    queryFn: () => api.get('/financeiro/dashboard').then((r) => r.data),
  })

  const { data: pagamentos = [], isLoading } = useQuery<Pagamento[]>({
    queryKey: ['pagamentos'],
    queryFn: () => api.get('/financeiro/pagamentos').then((r) => r.data),
  })

  const fmt = (v: number) =>
    `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-500 mt-1">Receitas, pagamentos e comissões</p>
      </div>

      {/* KPIs */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Receita Total',
              value: fmt(dashboard.receitaTotal),
              icon: <DollarSign size={18} />,
              bg: 'bg-green-500',
            },
            {
              label: 'Receita Pendente',
              value: fmt(dashboard.receitaPendente),
              icon: <TrendingUp size={18} />,
              bg: 'bg-blue-500',
            },
            {
              label: 'Inadimplência',
              value: fmt(dashboard.inadimplencia),
              icon: <AlertTriangle size={18} />,
              bg: 'bg-red-500',
            },
            {
              label: 'Comissões a Pagar',
              value: fmt(dashboard.comissoesPendentes),
              icon: <Users size={18} />,
              bg: 'bg-purple-500',
            },
          ].map((item) => (
            <div key={item.label} className="card flex items-start gap-4">
              <div className={clsx('p-3 rounded-xl text-white flex-shrink-0', item.bg)}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagamentos table */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Pagamentos</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
          </div>
        ) : pagamentos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum pagamento registrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {['Parcela', 'Valor', 'Vencimento', 'Status', 'Método'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagamentos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3">{p.parcela === 0 ? 'Entrada' : `${p.parcela}ª`}</td>
                    <td className="py-2 px-3 font-semibold">{fmt(p.valor)}</td>
                    <td className="py-2 px-3 text-gray-500">
                      {p.dataVencimento ? new Date(p.dataVencimento).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="py-2 px-3">
                      <span className={clsx('badge', STATUS_PAGAMENTO[p.status]?.css)}>
                        {STATUS_PAGAMENTO[p.status]?.label || p.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400">{p.metodo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
