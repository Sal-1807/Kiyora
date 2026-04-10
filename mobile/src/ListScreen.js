import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, SEV_COLOR, SEV_BG, SEV_LABEL, SEV_ABBR, STATUS_CFG, timeAgo } from './data';

const FILTERS = ['All', 'High', 'Medium', 'Low', 'Reported', 'In Progress', 'Cleaned'];

export default function ListScreen({ reports, onOpenReport, onFlyTo }) {
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => {
    if (active === 'All') return reports;
    if (['High','Medium','Low'].includes(active))
      return reports.filter(r => r.severity === active.toLowerCase());
    return reports.filter(r => r.status === active);
  }, [reports, active]);

  const stats = useMemo(() => ({
    total:      reports.length,
    inProgress: reports.filter(r => r.status === 'In Progress').length,
    cleaned:    reports.filter(r => r.status === 'Cleaned').length,
    high:       reports.filter(r => r.severity === 'high' && r.status !== 'Cleaned').length,
  }), [reports]);

  function renderCard({ item: r }) {
    const cfg = STATUS_CFG[r.status];
    return (
      <TouchableOpacity
        style={[s.card, { borderLeftColor: SEV_COLOR[r.severity] }]}
        onPress={() => onOpenReport(r)}
        activeOpacity={0.75}
      >
        <View style={s.cardTop}>
          <View style={[s.iconBox, { backgroundColor: cfg.iconBg }]}>
            <Text style={s.icon}>{cfg.icon}</Text>
          </View>
          <View style={s.cardMeta}>
            <Text style={s.cardAddr} numberOfLines={1}>{r.address}</Text>
            <Text style={s.cardTime}>{timeAgo(r.timestamp)}</Text>
          </View>
          <View style={[s.sevBadge, { backgroundColor: SEV_BG[r.severity] }]}>
            <Text style={[s.sevBadgeTxt, { color: SEV_COLOR[r.severity] }]}>
              {SEV_ABBR[r.severity]}
            </Text>
          </View>
        </View>

        <Text style={s.cardDesc} numberOfLines={2}>{r.description}</Text>

        <View style={s.cardFooter}>
          <View style={s.statusRow}>
            <View style={[s.dot, { backgroundColor: cfg.dot }]} />
            <Text style={s.statusTxt}>{r.status}</Text>
          </View>
          <View style={s.cardActions}>
            {r.status !== 'Cleaned' && (
              <TouchableOpacity onPress={() => onOpenReport(r)} hitSlop={{ top:8,bottom:8,left:8,right:8 }}>
                <Text style={s.actionTxt}>
                  {r.status === 'Reported' ? 'Claim →' : 'Mark Cleaned →'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => onFlyTo(r)} hitSlop={{ top:8,bottom:8,left:8,right:8 }}>
              <Text style={s.flyTxt}>🗺 View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Dashboard stats */}
      <View style={s.dashboard}>
        <View style={[s.statCard, { borderTopColor: COLORS.textPrimary }]}>
          <Text style={s.statVal}>{stats.total}</Text>
          <Text style={s.statLabel}>Total</Text>
        </View>
        <View style={[s.statCard, { borderTopColor: COLORS.orange }]}>
          <Text style={[s.statVal, { color: COLORS.orange }]}>{stats.inProgress}</Text>
          <Text style={s.statLabel}>In Progress</Text>
        </View>
        <View style={[s.statCard, { borderTopColor: COLORS.green }]}>
          <Text style={[s.statVal, { color: COLORS.green }]}>{stats.cleaned}</Text>
          <Text style={s.statLabel}>Cleaned ✓</Text>
        </View>
        <View style={[s.statCard, { borderTopColor: COLORS.red }]}>
          <Text style={[s.statVal, { color: COLORS.red }]}>{stats.high}</Text>
          <Text style={s.statLabel}>High Sev.</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.filterBar}
        contentContainerStyle={s.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.chip, active === f && s.chipActive]}
            onPress={() => setActive(f)}
            activeOpacity={0.7}
          >
            <Text style={[s.chipTxt, active === f && s.chipTxtActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={s.countTxt}>
        {filtered.length} spot{filtered.length !== 1 ? 's' : ''}
        {active !== 'All' ? ` · ${active}` : ''}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        renderItem={renderCard}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 36 }}>🔍</Text>
            <Text style={s.emptyTxt}>No reports match this filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  dashboard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    paddingHorizontal: 12, paddingVertical: 12, gap: 8,
  },
  statCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 10, padding: 10,
    borderTopWidth: 3,
  },
  statVal: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 26 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2, textAlign: 'center' },

  filterBar: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexGrow: 0 },
  filterContent: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },

  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  chipTxt: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  chipTxtActive: { color: '#fff', fontWeight: '700' },

  countTxt: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, paddingVertical: 8 },

  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },

  card: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  iconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18 },
  cardMeta: { flex: 1 },
  cardAddr: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  cardTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  sevBadgeTxt: { fontSize: 11, fontWeight: '700' },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 10 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  cardActions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  actionTxt: { fontSize: 12, color: COLORS.green, fontWeight: '700' },
  flyTxt: { fontSize: 12, color: COLORS.blue, fontWeight: '600' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTxt: { fontSize: 14, color: COLORS.textMuted },
});
