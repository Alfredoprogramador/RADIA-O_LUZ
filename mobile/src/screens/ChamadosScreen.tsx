import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const mockChamados = [
  { id: '001', cliente: 'João Silva', tipo: 'Corretiva', prioridade: 'alta', status: 'aberto', descricao: 'Inversor não está comunicando com o monitoramento' },
  { id: '002', cliente: 'Maria Santos', tipo: 'Limpeza', prioridade: 'baixa', status: 'agendado', descricao: 'Limpeza preventiva semestral dos painéis' },
  { id: '003', cliente: 'Pedro Costa', tipo: 'Garantia', prioridade: 'media', status: 'em_atendimento', descricao: 'Painel com microtrinca detectada no monitoramento' },
]

const PRIORIDADE_COLOR: Record<string, string> = {
  baixa: '#22c55e',
  media: '#f59e0b',
  alta: '#f97316',
  critica: '#ef4444',
}

export default function ChamadosScreen() {
  const [chamados] = useState(mockChamados)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Chamados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {chamados.map((c) => (
          <TouchableOpacity key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.prioridadeDot, { backgroundColor: PRIORIDADE_COLOR[c.prioridade] || '#9ca3af' }]} />
              <Text style={styles.clienteNome}>{c.cliente}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{c.status}</Text>
              </View>
            </View>
            <Text style={styles.tipo}>{c.tipo}</Text>
            <Text style={styles.descricao} numberOfLines={2}>{c.descricao}</Text>
            <View style={styles.acoes}>
              <TouchableOpacity style={styles.btnAcao}>
                <Ionicons name="camera-outline" size={18} color="#f97316" />
                <Text style={styles.btnAcaoText}>Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAcao}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#22c55e" />
                <Text style={styles.btnAcaoText}>Concluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAcao}>
                <Ionicons name="navigate-outline" size={18} color="#3b82f6" />
                <Text style={styles.btnAcaoText}>Rota</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  prioridadeDot: { width: 10, height: 10, borderRadius: 5 },
  clienteNome: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  statusBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  statusText: { fontSize: 11, color: '#92400e', fontWeight: '500' },
  tipo: { fontSize: 13, color: '#f97316', fontWeight: '500', marginBottom: 4 },
  descricao: { fontSize: 13, color: '#6b7280', marginBottom: 12 },
  acoes: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 12 },
  btnAcao: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btnAcaoText: { fontSize: 13, color: '#374151' },
})
