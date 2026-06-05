import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ClientesPage from './pages/crm/ClientesPage'
import LeadsPage from './pages/crm/LeadsPage'
import SimulacoesPage from './pages/vendas/SimulacoesPage'
import ContratosPage from './pages/vendas/ContratosPage'
import ProjetosPage from './pages/projetos/ProjetosPage'
import InstalacaoPage from './pages/instalacao/InstalacaoPage'
import ManutencaoPage from './pages/manutencao/ManutencaoPage'
import FinanceiroPage from './pages/financeiro/FinanceiroPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="crm/clientes" element={<ClientesPage />} />
        <Route path="crm/leads" element={<LeadsPage />} />
        <Route path="vendas/simulacoes" element={<SimulacoesPage />} />
        <Route path="vendas/contratos" element={<ContratosPage />} />
        <Route path="projetos" element={<ProjetosPage />} />
        <Route path="instalacao" element={<InstalacaoPage />} />
        <Route path="manutencao" element={<ManutencaoPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
      </Route>
    </Routes>
  )
}

export default App
