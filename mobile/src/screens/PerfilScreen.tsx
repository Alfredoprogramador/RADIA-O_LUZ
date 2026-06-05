import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function PerfilScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#f97316" />
        </View>
        <Text style={styles.name}>Carlos Técnico</Text>
        <Text style={styles.role}>Técnico de Instalação</Text>
        <View style={styles.regionBadge}>
          <Ionicons name="location" size={14} color="#f97316" />
          <Text style={styles.regionText}>Goiânia / GO</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumo do Mês</Text>
        {[
          { label: 'Instalações Concluídas', value: '8' },
          { label: 'Chamados Atendidos', value: '23' },
          { label: 'Avaliação Média', value: '4.8 ⭐' },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {[
        { icon: 'settings-outline', label: 'Configurações' },
        { icon: 'notifications-outline', label: 'Notificações' },
        { icon: 'help-circle-outline', label: 'Ajuda' },
        { icon: 'log-out-outline', label: 'Sair' },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuItem}>
          <Ionicons name={item.icon as any} size={20} color="#374151" />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700', color: '#111827' },
  role: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  regionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  regionText: { fontSize: 13, color: '#c2410c' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  infoLabel: { fontSize: 14, color: '#6b7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8 },
  menuLabel: { flex: 1, fontSize: 15, color: '#374151' },
})
