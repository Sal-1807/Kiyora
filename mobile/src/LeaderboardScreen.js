import React from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, SEV_POINTS } from './data';
import { useLang } from './LangContext';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ leaderboard }) {
  const { t } = useLang();

  const stats = [
    { label: t('low') + ' cleanup',    pts: SEV_POINTS.low,    color: COLORS.green,  bg: COLORS.greenBg  },
    { label: t('medium') + ' cleanup', pts: SEV_POINTS.medium, color: COLORS.orange, bg: COLORS.orangeBg },
    { label: t('high') + ' cleanup',   pts: SEV_POINTS.high,   color: COLORS.red,    bg: COLORS.redBg    },
  ];

  function renderRow({ item, index }) {
    const medal = MEDALS[index] || null;
    return (
      <View style={[s.row, item.isMe && s.rowMe]}>
        <View style={s.rankBox}>
          {medal
            ? <Text style={s.medal}>{medal}</Text>
            : <View style={s.rankNumBox}><Text style={s.rankNum}>{index + 1}</Text></View>}
        </View>
        <View style={s.nameBox}>
          <Text style={s.name} numberOfLines={1}>{item.name}</Text>
          {item.isMe && (
            <View style={s.youBadge}>
              <Text style={s.youBadgeTxt}>{t('you')}</Text>
            </View>
          )}
        </View>
        <View style={s.statsBox}>
          <View style={s.cleanupPill}>
            <Text style={s.cleanupTxt}>{item.cleanups} <Text style={s.cleanupSub}>{t('cleanups')}</Text></Text>
          </View>
          <Text style={[s.score, item.isMe && { color: COLORS.green }]}>
            {item.score}
            <Text style={s.scoreSub}> {t('pts')}</Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Points guide */}
      <View style={s.pointsCard}>
        <Text style={s.pointsTitle}>🏅 Points per Cleanup</Text>
        <View style={s.pointsRow}>
          {stats.map(sv => (
            <View key={sv.label} style={[s.pointsChip, { backgroundColor: sv.bg }]}>
              <Text style={[s.pointsChipVal, { color: sv.color }]}>{sv.pts}</Text>
              <Text style={[s.pointsChipLbl, { color: sv.color }]}>{sv.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Table header */}
      <View style={s.tableHead}>
        <Text style={s.thRank}>#</Text>
        <Text style={[s.thName, { flex: 1 }]}>{t('volunteer') || 'Volunteer'}</Text>
        <Text style={s.thScore}>{t('score')}</Text>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={item => item.id || item.name}
        renderItem={renderRow}
        contentContainerStyle={s.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 36 }}>🏆</Text>
            <Text style={s.emptyTxt}>No cleanups yet. Be the first!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // Points guide
  pointsCard: {
    backgroundColor: COLORS.surface,
    margin: 14, borderRadius: 14,
    padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  pointsTitle: {
    fontSize: 12, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 10,
  },
  pointsRow: { flexDirection: 'row', gap: 8 },
  pointsChip: {
    flex: 1, borderRadius: 10, paddingVertical: 10,
    alignItems: 'center', gap: 2,
  },
  pointsChipVal: { fontSize: 20, fontWeight: '800', lineHeight: 24 },
  pointsChipLbl: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  // Table header
  tableHead: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 6,
  },
  thRank: {
    width: 44, fontSize: 10, fontWeight: '700',
    color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  thName: {
    fontSize: 10, fontWeight: '700',
    color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  thScore: {
    width: 120, textAlign: 'right',
    fontSize: 10, fontWeight: '700',
    color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Rows
  list: { paddingHorizontal: 14, paddingBottom: 24 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  rowMe: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenBg,
  },
  rankBox: { width: 40, alignItems: 'center' },
  medal: { fontSize: 22 },
  rankNumBox: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  rankNum: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },

  nameBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, flexShrink: 1 },
  youBadge: {
    backgroundColor: COLORS.green, borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  youBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#fff' },

  statsBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cleanupPill: {
    backgroundColor: COLORS.surface2, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  cleanupTxt: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  cleanupSub: { fontSize: 10, fontWeight: '400', opacity: 0.7 },
  score: {
    fontSize: 16, fontWeight: '800', color: COLORS.textPrimary,
    minWidth: 54, textAlign: 'right',
  },
  scoreSub: { fontSize: 10, fontWeight: '500' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTxt: { fontSize: 14, color: COLORS.textMuted },
});
