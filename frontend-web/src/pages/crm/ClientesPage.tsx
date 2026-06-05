import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPlus, Search, Phone, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { clsx } from 'clsx'

const STATUS_LABELS: Record<string, { label: string; css: string }> = {
  ativo: { label: 'Ativo', css: 'badge-green' },
  inativo: { label: 'Inativo', css: 'badge-gray' },
  prospecto: { label: 'Prospecto', css: 'badge-yellow' },
  bloqueado: { label: 'Bloqueado', css: 'badge-red' },
}

interface Cliente {
  id: string
  nome: string
  cpfCnpj: string
  email: string
  telefone: string
  cidade: string
  estado: string
  status: string
  criadoEm: string
}

export default function ClientesPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    cpfCnpj: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cidade: '',
    estado: '',
    consumoMensalKwh: '',
    valorContaMedia: '',
  })

  const { data: clientes = [], isLoading } = useQuery<Cliente[]>({
    queryKey: ['clientes', search],
    queryFn: () =>
      api.get('/crm/clientes', { params: { search: search || undefined } }).then((r) => r.data),
  })

  const criarMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/crm/clientes', data),
    onSuccess: () => {
      toast.success('Cliente criado com sucesso!')
      qc.invalidateQueries({ queryKey: ['clientes'] })
      setShowForm(false)
      setForm({ nome: '', cpfCnpj: '', email: '', telefone: '', whatsapp: '', cidade: '', estado: '', consumoMensalKwh: '', valorContaMedia: '' })
    },
  })

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Gestão de clientes cadastrados</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <UserPlus size={16} />
          Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold mb-4">Novo Cliente</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome *</label>
                  <input className="input mt-1" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CPF/CNPJ *</label>
                  <input className="input mt-1" value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">E-mail</label>
                  <input className="input mt-1" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <input className="input mt-1" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <input className="input mt-1" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <input className="input mt-1" maxLength={2} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Consumo Médio (kWh)</label>
                  <input className="input mt-1" type="number" value={form.consumoMensalKwh} onChange={(e) => setForm({ ...form, consumoMensalKwh: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Valor Conta Média (R$)</label>
                  <input className="input mt-1" type="number" value={form.valorContaMedia} onChange={(e) => setForm({ ...form, valorContaMedia: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn-secondary flex-1" onClick={() => setShowForm(false)}>Cancelar</button>
              <button
                className="btn-primary flex-1"
                disabled={criarMutation.isPending}
                onClick={() => criarMutation.mutate(form)}
              >
                {criarMutation.isPending ? 'Salvando...' : 'Criar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : clientes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nome', 'CPF/CNPJ', 'Contato', 'Localização', 'Status', 'Cadastro'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{c.cpfCnpj}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col gap-0.5">
                      {c.email && <span className="flex items-center gap-1 text-gray-500"><Mail size={12} />{c.email}</span>}
                      {c.telefone && <span className="flex items-center gap-1 text-gray-500"><Phone size={12} />{c.telefone}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {c.cidade && <span className="flex items-center gap-1"><MapPin size={12} />{c.cidade}/{c.estado}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('badge', STATUS_LABELS[c.status]?.css || 'badge-gray')}>
                      {STATUS_LABELS[c.status]?.label || c.status}
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
