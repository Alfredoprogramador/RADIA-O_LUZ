import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { clsx } from 'clsx'

const ETAPAS = [
  { key: 'novo', label: 'Novos', color: 'bg-blue-100 border-blue-300' },
  { key: 'qualificado', label: 'Qualificados', color: 'bg-yellow-100 border-yellow-300' },
  { key: 'orcamento_enviado', label: 'Orçamento Enviado', color: 'bg-purple-100 border-purple-300' },
  { key: 'negociacao', label: 'Negociação', color: 'bg-orange-100 border-orange-300' },
  { key: 'fechado_ganho', label: '✅ Fechados', color: 'bg-green-100 border-green-300' },
  { key: 'fechado_perdido', label: '❌ Perdidos', color: 'bg-red-100 border-red-300' },
]

const ORIGENS: Record<string, string> = {
  site: '🌐 Site',
  whatsapp: '💬 WhatsApp',
  indicacao: '🤝 Indicação',
  instagram: '📸 Instagram',
  facebook: '👍 Facebook',
  google_ads: '🔍 Google Ads',
  ligacao: '📞 Ligação',
  outros: '📋 Outros',
}

interface Lead {
  id: string
  nome: string
  email: string
  telefone: string
  origem: string
  status: string
  pontuacao: number
  cidade: string
  estado: string
  criadoEm: string
}

export default function LeadsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', origem: 'site', cidade: '', estado: '' })

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: () => api.get('/crm/leads').then((r) => r.data),
  })

  const { data: funil } = useQuery<Record<string, number>>({
    queryKey: ['funil'],
    queryFn: () => api.get('/crm/funil').then((r) => r.data),
  })

  const criarMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/crm/leads', data),
    onSuccess: () => {
      toast.success('Lead criado!')
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['funil'] })
      setShowForm(false)
    },
  })

  const moverMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/crm/leads/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['funil'] })
    },
  })

  const converterMutation = useMutation({
    mutationFn: (id: string) => api.post(`/crm/leads/${id}/converter`),
    onSuccess: () => {
      toast.success('Lead convertido em cliente!')
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['clientes'] })
    },
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads & Funil de Vendas</h1>
          <p className="text-gray-500 mt-1">Acompanhe seu pipeline de vendas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Novo Lead
        </button>
      </div>

      {/* Funil summary */}
      {funil && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ETAPAS.map((e) => (
            <div key={e.key} className={clsx('rounded-xl border-2 p-3 text-center', e.color)}>
              <p className="text-2xl font-bold">{funil[e.key] || 0}</p>
              <p className="text-xs text-gray-600 mt-1">{e.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto">
        {ETAPAS.slice(0, 4).map((etapa) => (
          <div key={etapa.key} className="card p-3 min-w-[220px]">
            <h3 className="font-semibold text-sm text-gray-700 mb-3 pb-2 border-b">{etapa.label}</h3>
            <div className="space-y-2">
              {leads
                .filter((l) => l.status === etapa.key)
                .map((lead) => (
                  <div key={lead.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="font-medium text-sm text-gray-900">{lead.nome}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{ORIGENS[lead.origem] || lead.origem}</p>
                    {lead.cidade && (
                      <p className="text-xs text-gray-400">{lead.cidade}/{lead.estado}</p>
                    )}
                    <div className="flex gap-1 mt-2">
                      {etapa.key !== 'fechado_ganho' && etapa.key !== 'fechado_perdido' && (
                        <button
                          onClick={() => converterMutation.mutate(lead.id)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                        >
                          → Cliente
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Novo Lead</h2>
            <div className="space-y-3">
              <input
                className="input"
                placeholder="Nome *"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              <input
                className="input"
                placeholder="E-mail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="input"
                placeholder="Telefone"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
              <select
                className="input"
                value={form.origem}
                onChange={(e) => setForm({ ...form, origem: e.target.value })}
              >
                {Object.entries(ORIGENS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input className="input" placeholder="Cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
                <input className="input" placeholder="UF" maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancelar</button>
              <button
                className="btn-primary flex-1"
                disabled={criarMutation.isPending}
                onClick={() => criarMutation.mutate(form)}
              >
                {criarMutation.isPending ? 'Salvando...' : 'Criar Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
