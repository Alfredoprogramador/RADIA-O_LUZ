import { useQuery } from '@tanstack/react-query'
import { FileText, CheckCircle } from 'lucide-react'
import api from '../../services/api'
import { clsx } from 'clsx'

const STATUS: Record<string, { label: string; css: string }> = {
  rascunho: { label: 'Rascunho', css: 'badge-gray' },
  enviado: { label: 'Enviado', css: 'badge-yellow' },
  assinado: { label: 'Assinado', css: 'badge-green' },
  cancelado: { label: 'Cancelado', css: 'badge-red' },
  concluido: { label: 'Concluído', css: 'badge-blue' },
}

const PAGAMENTO: Record<string, string> = {
  financiamento: 'Financiamento',
  leasing: 'Leasing',
  fco: 'FCO',
  a_vista: 'À Vista',
  parcelado: 'Parcelado',
  consorcio: 'Consórcio',
}

interface Contrato {
  id: string
  numero: string
  cliente: { nome: string }
  valorTotal: number
  formaPagamento: string
  status: string
  dataAssinatura: string
  criadoEm: string
}

export default function ContratosPage() {
  const { data: contratos = [], isLoading } = useQuery<Contrato[]>({
    queryKey: ['contratos'],
    queryFn: () => api.get('/vendas/contratos').then((r) => r.data),
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
        <p className="text-gray-500 mt-1">Gestão de contratos e aceites digitais</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : contratos.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum contrato cadastrado</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Nº Contrato', 'Cliente', 'Valor Total', 'Forma de Pagamento', 'Status', 'Data'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contratos.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-700">{c.numero}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.cliente?.nome || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    R$ {Number(c.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{PAGAMENTO[c.formaPagamento] || c.formaPagamento}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', STATUS[c.status]?.css || 'badge-gray')}>
                      {STATUS[c.status]?.label || c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(c.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
