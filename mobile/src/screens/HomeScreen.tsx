import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>RADIAÇÃO_LUZ</Text>
          <Text style={styles.subtitle}>Painel do Técnico</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#f97316" />
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Chamados Hoje', value: '3', icon: 'wrench', color: '#f97316' },
          { label: 'Instalações', value: '1', icon: 'construct', color: '#3b82f6' },
          { label: 'Concluídos', value: '12', icon: 'checkmark-circle', color: '#22c55e' },
          { label: 'Pendentes', value: '5', icon: 'time', color: '#ef4444' },
        ].map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Ionicons name={item.icon as any} size={24} color={item.color} />
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      <View style={styles.actionsGrid}>
        {[
          { label: 'Novo Chamado', icon: 'add-circle' },
          { label: 'Registrar Foto', icon: 'camera' },
          { label: 'Checklist', icon: 'checkbox' },
          { label: 'Assinatura', icon: 'pencil' },
        ].map((action) => (
          <TouchableOpacity key={action.label} style={styles.actionBtn}>
            <Ionicons name={action.icon as any} size={28} color="#f97316" />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: '700', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: { fontSize: 13, color: '#374151', marginTop: 8, textAlign: 'center', fontWeight: '500' },
})
