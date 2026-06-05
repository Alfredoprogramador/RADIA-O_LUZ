import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ETAPAS = [
  { id: 1, label: 'Visita Técnica', done: true },
  { id: 2, label: 'Infraestrutura', done: true },
  { id: 3, label: 'Montagem dos Painéis', done: false },
  { id: 4, label: 'Parte Elétrica', done: false },
  { id: 5, label: 'Ativação', done: false },
]

const CHECKLIST = [
  { item: 'EPI completo disponível', done: true },
  { item: 'Equipamentos testados', done: true },
  { item: 'Desligamento da rede verificado', done: false },
  { item: 'Estrutura do telhado avaliada', done: false },
  { item: 'Cliente informado', done: false },
]

export default function InstalacaoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ordem de Instalação</Text>
      <Text style={styles.subtitle}>#INS-2024-0047 • João Silva</Text>

      {/* Progresso */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Progresso da Instalação</Text>
        {ETAPAS.map((e, idx) => (
          <View key={e.id} style={styles.etapaRow}>
            <View style={[styles.etapaDot, e.done ? styles.etapaDotDone : styles.etapaDotPending]}>
              {e.done ? (
                <Ionicons name="checkmark" size={14} color="#fff" />
              ) : (
                <Text style={styles.etapaDotNum}>{e.id}</Text>
              )}
            </View>
            {idx < ETAPAS.length - 1 && (
              <View style={[styles.etapaLine, e.done ? styles.etapaLineDone : styles.etapaLinePending]} />
            )}
            <Text style={[styles.etapaLabel, e.done && styles.etapaLabelDone]}>{e.label}</Text>
          </View>
        ))}
      </View>

      {/* Checklist */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Checklist de Segurança</Text>
        {CHECKLIST.map((item) => (
          <TouchableOpacity key={item.item} style={styles.checkItem}>
            <Ionicons
              name={item.done ? 'checkbox' : 'square-outline'}
              size={22}
              color={item.done ? '#22c55e' : '#d1d5db'}
            />
            <Text style={[styles.checkLabel, item.done && styles.checkLabelDone]}>
              {item.item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ações */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
          <Ionicons name="camera-outline" size={18} color="#374151" />
          <Text style={styles.btnSecondaryText}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]}>
          <Ionicons name="pencil-outline" size={18} color="#fff" />
          <Text style={styles.btnPrimaryText}>Assinar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 12 },
  etapaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  etapaDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  etapaDotDone: { backgroundColor: '#22c55e' },
  etapaDotPending: { backgroundColor: '#e5e7eb' },
  etapaDotNum: { fontSize: 12, fontWeight: '700', color: '#9ca3af' },
  etapaLine: { position: 'absolute', left: 14, top: 28, width: 2, height: 8 },
  etapaLineDone: { backgroundColor: '#22c55e' },
  etapaLinePending: { backgroundColor: '#e5e7eb' },
  etapaLabel: { fontSize: 14, color: '#374151' },
  etapaLabelDone: { color: '#22c55e', textDecorationLine: 'line-through' },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  checkLabel: { fontSize: 14, color: '#374151' },
  checkLabelDone: { color: '#9ca3af', textDecorationLine: 'line-through' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 10 },
  btnPrimary: { backgroundColor: '#f97316' },
  btnSecondary: { backgroundColor: '#f3f4f6' },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnSecondaryText: { color: '#374151', fontWeight: '600', fontSize: 15 },
})
