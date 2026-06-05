import { useQuery } from '@tanstack/react-query'
import { Hammer, CheckCircle2, Clock, Users } from 'lucide-react'
import api from '../../services/api'
import { clsx } from 'clsx'

const STATUS: Record<string, { label: string; css: string }> = {
  agendada: { label: 'Agendada', css: 'badge-blue' },
  visita_tecnica: { label: '1. Visita Técnica', css: 'badge-yellow' },
  infraestrutura: { label: '2. Infraestrutura', css: 'badge-yellow' },
  montagem: { label: '3. Montagem', css: 'badge-yellow' },
  eletrica: { label: '4. Elétrica', css: 'badge-yellow' },
  ativacao: { label: '5. Ativação', css: 'badge-yellow' },
  concluida: { label: '✅ Concluída', css: 'badge-green' },
  cancelada: { label: 'Cancelada', css: 'badge-red' },
}

const ETAPAS_PIPELINE = ['agendada', 'visita_tecnica', 'infraestrutura', 'montagem', 'eletrica', 'ativacao', 'concluida']

interface Ordem {
  id: string
  status: string
  dataAgendamento: string
  dataInicio: string
  dataConclusao: string
  equipeResponsavel: { nome: string; funcao: string }[]
  criadoEm: string
}

export default function InstalacaoPage() {
  const { data: ordens = [], isLoading } = useQuery<Ordem[]>({
    queryKey: ['ordens-instalacao'],
    queryFn: () => api.get('/instalacao/ordens').then((r) => r.data),
  })

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instalações</h1>
        <p className="text-gray-500 mt-1">Acompanhamento das ordens de instalação</p>
      </div>

      {ordens.length === 0 ? (
        <div className="card text-center py-16">
          <Hammer size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhuma ordem de instalação</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordens.map((o) => {
            const etapaIdx = ETAPAS_PIPELINE.indexOf(o.status)
            return (
              <div key={o.id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-mono text-gray-400">#{o.id.slice(0, 8).toUpperCase()}</p>
                    {o.dataAgendamento && (
                      <p className="text-sm text-gray-500">
                        <Clock size={12} className="inline mr-1" />
                        Agendado para {new Date(o.dataAgendamento).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <span className={clsx('badge', STATUS[o.status]?.css)}>
                    {STATUS[o.status]?.label || o.status}
                  </span>
                </div>

                {/* Progress pipeline */}
                <div className="flex items-center gap-0 mb-4">
                  {ETAPAS_PIPELINE.slice(0, -1).map((etapa, idx) => (
                    <div key={etapa} className="flex items-center flex-1">
                      <div
                        className={clsx(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                          idx <= etapaIdx ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400',
                        )}
                      >
                        {idx + 1}
                      </div>
                      {idx < 5 && (
                        <div
                          className={clsx(
                            'flex-1 h-1',
                            idx < etapaIdx ? 'bg-primary-600' : 'bg-gray-200',
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {o.equipeResponsavel && o.equipeResponsavel.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} />
                    <span>
                      Equipe: {o.equipeResponsavel.map((m) => m.nome).join(', ')}
                    </span>
                  </div>
                )}

                {o.dataConclusao && (
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                    <CheckCircle2 size={14} />
                    <span>Concluída em {new Date(o.dataConclusao).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
