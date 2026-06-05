import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Wrench, AlertCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { clsx } from 'clsx'

const STATUS: Record<string, { label: string; css: string }> = {
  aberto: { label: 'Aberto', css: 'badge-yellow' },
  em_atendimento: { label: 'Em Atendimento', css: 'badge-blue' },
  aguardando_peca: { label: 'Aguardando Peça', css: 'badge-yellow' },
  agendado: { label: 'Agendado', css: 'badge-blue' },
  concluido: { label: 'Concluído', css: 'badge-green' },
  cancelado: { label: 'Cancelado', css: 'badge-red' },
}

const PRIORIDADE: Record<string, string> = {
  baixa: '🟢 Baixa',
  media: '🟡 Média',
  alta: '🟠 Alta',
  critica: '🔴 Crítica',
}

const TIPO: Record<string, string> = {
  corretiva: '🔧 Corretiva',
  preventiva: '🔍 Preventiva',
  limpeza: '🧹 Limpeza',
  monitoramento: '📡 Monitoramento',
  garantia: '📋 Garantia',
}

interface Chamado {
  id: string
  tipo: string
  prioridade: string
  status: string
  descricaoProblema: string
  tecnicoNome: string
  dataAgendamento: string
  cliente: { nome: string }
  criadoEm: string
}

export default function ManutencaoPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ clienteId: '', tipo: 'corretiva', prioridade: 'media', descricaoProblema: '' })

  const { data: chamados = [], isLoading } = useQuery<Chamado[]>({
    queryKey: ['chamados'],
    queryFn: () => api.get('/manutencao/chamados').then((r) => r.data),
  })

  const { data: sla } = useQuery({
    queryKey: ['sla'],
    queryFn: () => api.get('/manutencao/relatorio/sla').then((r) => r.data),
  })

  const criarMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/manutencao/chamados', data),
    onSuccess: () => {
      toast.success('Chamado aberto!')
      qc.invalidateQueries({ queryKey: ['chamados'] })
      setShowForm(false)
    },
  })

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manutenção e Garantia</h1>
          <p className="text-gray-500 mt-1">Chamados técnicos e gestão de SLA</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Abrir Chamado
        </button>
      </div>

      {/* SLA KPIs */}
      {sla && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Abertos', value: sla.abertos, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Em Atendimento', value: sla.emAtendimento, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Concluídos', value: sla.concluidos, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Tempo Médio (h)', value: sla.tempoMedioResposta, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((item) => (
            <div key={item.label} className={clsx('rounded-xl p-4 border', item.bg)}>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className={clsx('text-2xl font-bold mt-1', item.color)}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Abrir Chamado de Manutenção</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">ID do Cliente *</label>
                <input className="input mt-1" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select className="input mt-1" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                    {Object.entries(TIPO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Prioridade</label>
                  <select className="input mt-1" value={form.prioridade} onChange={(e) => setForm({ ...form, prioridade: e.target.value })}>
                    {Object.entries(PRIORIDADE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição do Problema *</label>
                <textarea
                  className="input mt-1 h-24 resize-none"
                  value={form.descricaoProblema}
                  onChange={(e) => setForm({ ...form, descricaoProblema: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn-primary flex-1" disabled={criarMutation.isPending} onClick={() => criarMutation.mutate(form)}>
                {criarMutation.isPending ? 'Abrindo...' : 'Abrir Chamado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : chamados.length === 0 ? (
        <div className="card text-center py-16">
          <Wrench size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum chamado aberto</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chamados.map((c) => (
            <div key={c.id} className="card">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{c.cliente?.nome || 'Cliente'}</span>
                    <span className="text-xs text-gray-400 font-mono">#{c.id.slice(0, 8)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{c.descricaoProblema}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{TIPO[c.tipo]}</span>
                    <span>{PRIORIDADE[c.prioridade]}</span>
                    {c.tecnicoNome && <span>👷 {c.tecnicoNome}</span>}
                    {c.dataAgendamento && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(c.dataAgendamento).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
                <span className={clsx('badge ml-2 flex-shrink-0', STATUS[c.status]?.css)}>
                  {STATUS[c.status]?.label || c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
