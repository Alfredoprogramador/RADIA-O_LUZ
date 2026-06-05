import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function MonitoramentoScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Monitoramento Solar</Text>
      <Text style={styles.subtitle}>Geração em tempo real</Text>

      {/* Geração atual */}
      <View style={[styles.card, styles.cardHighlight]}>
        <Ionicons name="sunny" size={40} color="#f97316" />
        <Text style={styles.geracaoValor}>4.2 kW</Text>
        <Text style={styles.geracaoLabel}>Geração Agora</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Hoje', value: '18.4 kWh', icon: 'today' },
          { label: 'Este Mês', value: '412 kWh', icon: 'calendar' },
          { label: 'Economia Mês', value: 'R$ 350', icon: 'cash' },
        ].map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Ionicons name={item.icon as any} size={20} color="#f97316" />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Alertas */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Alertas</Text>
        <View style={styles.alertItem}>
          <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          <Text style={styles.alertText}>Sistema operando normalmente</Text>
        </View>
        <View style={styles.alertItem}>
          <Ionicons name="information-circle" size={20} color="#3b82f6" />
          <Text style={styles.alertText}>Eficiência: 97.3%</Text>
        </View>
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
  cardHighlight: { alignItems: 'center', paddingVertical: 32, backgroundColor: '#fff7ed' },
  geracaoValor: { fontSize: 48, fontWeight: '700', color: '#f97316', marginTop: 12 },
  geracaoLabel: { fontSize: 14, color: '#9a3412', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 6 },
  statLabel: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 12 },
  alertItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  alertText: { fontSize: 14, color: '#374151' },
})
