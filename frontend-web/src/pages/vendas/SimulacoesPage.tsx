import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Zap, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'

interface Simulacao {
  id: string
  nomeProspecto: string
  consumoMensalKwh: number
  valorContaMensal: number
  potenciaKwp: number
  quantidadePaineis: number
  geracaoMensalEstimadaKwh: number
  economiaAnualEstimada: number
  paybackAnos: number
  valorProposta: number
  localizacao: string
  criadoEm: string
}

export default function SimulacoesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nomeProspecto: '',
    consumoMensalKwh: '',
    valorContaMensal: '',
    localizacao: '',
  })

  const { data: simulacoes = [], isLoading } = useQuery<Simulacao[]>({
    queryKey: ['simulacoes'],
    queryFn: () => api.get('/vendas/simulacoes').then((r) => r.data),
  })

  const criarMutation = useMutation({
    mutationFn: (data: { nomeProspecto: string; consumoMensalKwh: number; valorContaMensal: number; localizacao: string }) =>
      api.post('/vendas/simulacoes', data),
    onSuccess: () => {
      toast.success('Simulação criada com sucesso!')
      qc.invalidateQueries({ queryKey: ['simulacoes'] })
      setShowForm(false)
      setForm({ nomeProspecto: '', consumoMensalKwh: '', valorContaMensal: '', localizacao: '' })
    },
  })

  const handleSubmit = () => {
    criarMutation.mutate({
      nomeProspecto: form.nomeProspecto,
      consumoMensalKwh: Number(form.consumoMensalKwh),
      valorContaMensal: Number(form.valorContaMensal),
      localizacao: form.localizacao,
    })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulações Solares</h1>
          <p className="text-gray-500 mt-1">Calcule potência, economia e retorno do investimento</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nova Simulação
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-1">Nova Simulação Solar</h2>
            <p className="text-sm text-gray-500 mb-4">Insira os dados do cliente para calcular o sistema ideal</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome do Prospecto</label>
                <input className="input mt-1" value={form.nomeProspecto} onChange={(e) => setForm({ ...form, nomeProspecto: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Consumo Médio Mensal (kWh) *</label>
                <input className="input mt-1" type="number" min="0" value={form.consumoMensalKwh} onChange={(e) => setForm({ ...form, consumoMensalKwh: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Valor Médio da Conta (R$) *</label>
                <input className="input mt-1" type="number" min="0" value={form.valorContaMensal} onChange={(e) => setForm({ ...form, valorContaMensal: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Localização</label>
                <input className="input mt-1" placeholder="Ex: Goiânia, GO" value={form.localizacao} onChange={(e) => setForm({ ...form, localizacao: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn-primary flex-1" disabled={criarMutation.isPending} onClick={handleSubmit}>
                {criarMutation.isPending ? 'Calculando...' : '⚡ Calcular'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {simulacoes.map((s) => (
            <div key={s.id} className="card space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{s.nomeProspecto || 'Simulação'}</h3>
                  <p className="text-sm text-gray-400">{s.localizacao}</p>
                </div>
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Zap size={18} className="text-primary-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Potência</p>
                  <p className="font-bold text-orange-600">{s.potenciaKwp} kWp</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Painéis</p>
                  <p className="font-bold text-blue-600">{s.quantidadePaineis} un.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Economia/Ano</p>
                  <p className="font-bold text-green-600">
                    R$ {Number(s.economiaAnualEstimada).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Payback</p>
                  <p className="font-bold text-purple-600">{Number(s.paybackAnos).toFixed(1)} anos</p>
                </div>
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Valor da Proposta</p>
                  <p className="text-lg font-bold text-gray-900">
                    R$ {Number(s.valorProposta).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Consumo</p>
                  <p className="text-sm font-medium">{s.consumoMensalKwh} kWh/mês</p>
                </div>
              </div>
            </div>
          ))}

          {simulacoes.length === 0 && (
            <div className="col-span-3 card text-center py-16">
              <Zap size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Nenhuma simulação ainda. Crie a primeira!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
