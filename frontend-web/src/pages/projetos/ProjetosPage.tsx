import { useQuery } from '@tanstack/react-query'
import { FolderKanban, CheckCircle2, Clock } from 'lucide-react'
import api from '../../services/api'
import { clsx } from 'clsx'

const STATUS: Record<string, { label: string; css: string }> = {
  elaboracao: { label: 'Elaboração', css: 'badge-gray' },
  aguardando_aprovacao: { label: 'Aguardando Aprovação', css: 'badge-yellow' },
  em_analise_distribuidora: { label: 'Na Distribuidora', css: 'badge-blue' },
  aprovado: { label: 'Aprovado', css: 'badge-green' },
  reprovado: { label: 'Reprovado', css: 'badge-red' },
  homologado: { label: '✅ Homologado', css: 'badge-green' },
}

interface Projeto {
  id: string
  distribuidora: string
  status: string
  numeroProtocolo: string
  dataSubmissao: string
  dataAprovacao: string
  potenciaInstalada: number
  engenheiroResponsavel: string
  criadoEm: string
}

export default function ProjetosPage() {
  const { data: projetos = [], isLoading } = useQuery<Projeto[]>({
    queryKey: ['projetos'],
    queryFn: () => api.get('/projetos').then((r) => r.data),
  })

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Projetos Técnicos</h1>
        <p className="text-gray-500 mt-1">Controle de aprovação junto às distribuidoras</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : projetos.length === 0 ? (
        <div className="card text-center py-16">
          <FolderKanban size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum projeto técnico cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projetos.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.distribuidora}</h3>
                  {p.numeroProtocolo && (
                    <p className="text-xs text-gray-400 font-mono mt-0.5">#{p.numeroProtocolo}</p>
                  )}
                </div>
                <span className={clsx('badge', STATUS[p.status]?.css)}>
                  {STATUS[p.status]?.label || p.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                {p.potenciaInstalada && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Potência:</span>
                    <span className="font-medium">{p.potenciaInstalada} kWp</span>
                  </div>
                )}
                {p.engenheiroResponsavel && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Engenheiro:</span>
                    <span className="font-medium">{p.engenheiroResponsavel}</span>
                  </div>
                )}
                {p.dataSubmissao && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submetido:</span>
                    <span>{new Date(p.dataSubmissao).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {p.dataAprovacao && (
                  <div className="flex justify-between text-green-600">
                    <span>Aprovado:</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      {new Date(p.dataAprovacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
