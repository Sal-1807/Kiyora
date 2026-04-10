import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';

import { COLORS, SEED_REPORTS, SEED_LEADERBOARD, SEV_POINTS } from './src/data';
import { LangProvider, useLang } from './src/LangContext';
import MapScreen from './src/MapScreen';
import ListScreen from './src/ListScreen';
import LeaderboardScreen from './src/LeaderboardScreen';
import ReportModal from './src/ReportModal';
import AfterPhotoModal from './src/AfterPhotoModal';
import { Toast, useToast } from './src/Toast';

const Tab = createBottomTabNavigator();

function KiyoraTitle() {
  return (
    <View style={kt.row}>
      <Image source={require('./assets/icon.png')} style={kt.logo} />
      <Text style={kt.name}>Kiyora</Text>
    </View>
  );
}
const kt = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 30, height: 30, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.3 },
});

// ── Tab icon ──────────────────────────────────────────────────────────────────
function TabIcon({ label, focused }) {
  const map = { Map: '🗺️', Reports: '📋', Leaderboard: '🏆' };
  return (
    <View style={ti.wrap}>
      <Text style={ti.icon}>{map[label]}</Text>
      <Text style={[ti.label, focused && ti.labelActive]}>{label}</Text>
    </View>
  );
}
const ti = StyleSheet.create({
  wrap:        { alignItems: 'center', gap: 2 },
  icon:        { fontSize: 20 },
  label:       { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  labelActive: { color: COLORS.green, fontWeight: '700' },
});

// ── Inner app (inside LangProvider so useLang works) ─────────────────────────
function AppInner() {
  const { lang, t, toggleLang } = useLang();

  const [reports, setReports]       = useState(SEED_REPORTS);
  const [leaderboard, setLeaderboard] = useState(SEED_LEADERBOARD);
  const [modalVisible, setModal]    = useState(false);
  const [selected, setSelected]     = useState(null);
  const [prefillCoords, setPrefill] = useState(null);

  // After-photo modal
  const [afterVisible, setAfterVisible]   = useState(false);
  const [cleaningReport, setCleaningReport] = useState(null);

  const myStats = useRef({ cleanups: 0, score: 0 });
  const mapRef  = useRef(null);
  const navRef  = useNavigationContainerRef();
  const { message: toastMsg, opacity: toastOpacity, showToast } = useToast();

  const stats = {
    high:    reports.filter(r => r.severity === 'high' && r.status !== 'Cleaned').length,
    cleaned: reports.filter(r => r.status === 'Cleaned').length,
  };

  // ── Modal open/close ──────────────────────────────────────────────────────
  const openReport = useCallback((report, coords = null) => {
    setSelected(report);
    setPrefill(coords);
    setModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setModal(false);
    setSelected(null);
    setPrefill(null);
  }, []);

  // ── Submit new report ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(data => {
    setReports(prev => [{
      id: `r${Date.now()}`,
      status: 'Reported',
      afterImage: null,
      timestamp: new Date(),
      ...data,
    }, ...prev]);
    showToast(t('reportSubmitted'));
  }, [showToast, t]);

  // ── Claim cleanup ─────────────────────────────────────────────────────────
  const handleClaim = useCallback(id => {
    setReports(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'In Progress' } : r,
    ));
    showToast(t('claimToast'));
  }, [showToast, t]);

  // ── Start clean → open after-photo modal ──────────────────────────────────
  const handleStartClean = useCallback(reportId => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    setModal(false);
    setSelected(null);
    setPrefill(null);
    setCleaningReport(report);
    setAfterVisible(true);
  }, [reports]);

  // ── After modal closed without photo → pending_proof ─────────────────────
  const handleAfterClose = useCallback(() => {
    if (cleaningReport) {
      setReports(prev => prev.map(r =>
        r.id === cleaningReport.id && r.status === 'In Progress'
          ? { ...r, status: 'pending_proof' }
          : r,
      ));
      showToast(t('pendingProofToast'));
    }
    setAfterVisible(false);
    setCleaningReport(null);
  }, [cleaningReport, showToast, t]);

  // ── Complete clean: photo submitted ──────────────────────────────────────
  const handleCompleteClean = useCallback((id, afterImage) => {
    const report = reports.find(r => r.id === id);
    const severity = report?.severity || 'low';
    const pts = SEV_POINTS[severity];

    setReports(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'Cleaned', afterImage } : r,
    ));

    myStats.current.cleanups += 1;
    myStats.current.score    += pts;
    const { cleanups, score } = myStats.current;

    setLeaderboard(prev => {
      const next = prev.map(e => ({ ...e }));
      const idx  = next.findIndex(e => e.isMe);
      if (idx >= 0) {
        next[idx] = { ...next[idx], name: t('you'), cleanups, score };
      } else {
        next.push({ id: 'me', name: t('you'), cleanups, score, isMe: true });
      }
      return next.sort((a, b) => b.score - a.score);
    });

    setAfterVisible(false);
    setCleaningReport(null);
    showToast(t('cleanedToast'));
    setTimeout(() => showToast(t('pointsToast', { pts })), 1200);
  }, [reports, showToast, t]);

  // ── handleAction for backward compat (claim from ReportModal) ────────────
  const handleAction = useCallback((id, action) => {
    if (action === 'claim') handleClaim(id);
    if (action === 'clean') handleStartClean(id);
  }, [handleClaim, handleStartClean]);

  // ── Fly to report on map ──────────────────────────────────────────────────
  const handleFlyTo = useCallback(r => {
    navRef.current?.navigate('Map');
    setTimeout(() => mapRef.current?.flyTo(r), 300);
  }, [navRef]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContainer ref={navRef}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerStyle: {
                backgroundColor: COLORS.surface,
                borderBottomWidth: 1, borderBottomColor: COLORS.border,
                elevation: 0, shadowOpacity: 0,
              },
              headerTitleStyle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
              headerRight: () => (
                <View style={hs.row}>
                  {/* Language toggle */}
                  <TouchableOpacity style={hs.langBtn} onPress={toggleLang}>
                    <Text style={hs.langTxt}>{lang === 'en' ? 'हिं' : 'EN'}</Text>
                  </TouchableOpacity>
                  {stats.high > 0 && (
                    <View style={[hs.badge, { backgroundColor: COLORS.redBg }]}>
                      <Text style={[hs.badgeTxt, { color: COLORS.red }]}>{stats.high} High</Text>
                    </View>
                  )}
                  <View style={[hs.badge, { backgroundColor: COLORS.greenBg }]}>
                    <Text style={[hs.badgeTxt, { color: COLORS.green }]}>{stats.cleaned} Cleaned</Text>
                  </View>
                </View>
              ),
              tabBarStyle: {
                backgroundColor: COLORS.surface,
                borderTopColor: COLORS.border,
                height: Platform.OS === 'ios' ? 80 : 62,
                paddingBottom: Platform.OS === 'ios' ? 20 : 8,
                paddingTop: 8,
                elevation: 0, shadowOpacity: 0,
              },
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
            })}
          >
            <Tab.Screen name="Map" options={{ headerTitle: () => <KiyoraTitle /> }}>
              {() => (
                <MapScreen
                  ref={mapRef}
                  reports={reports}
                  onOpenReport={openReport}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Reports" options={{ headerTitle: () => <KiyoraTitle /> }}>
              {() => (
                <ListScreen
                  reports={reports}
                  leaderboard={leaderboard}
                  onOpenReport={openReport}
                  onFlyTo={handleFlyTo}
                />
              )}
            </Tab.Screen>

            <Tab.Screen name="Leaderboard" options={{ headerTitle: () => <KiyoraTitle /> }}>
              {() => (
                <LeaderboardScreen leaderboard={leaderboard} />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>

        <ReportModal
          visible={modalVisible}
          report={selected}
          prefillCoords={prefillCoords}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onAction={handleAction}
          onStartClean={handleStartClean}
        />

        <AfterPhotoModal
          visible={afterVisible}
          report={cleaningReport}
          onClose={handleAfterClose}
          onSubmit={handleCompleteClean}
        />

        <Toast message={toastMsg} opacity={toastOpacity} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ── Root: wrap with LangProvider ─────────────────────────────────────────────
function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}

const hs = StyleSheet.create({
  row:     { flexDirection: 'row', gap: 6, paddingRight: 14, alignItems: 'center' },
  badge:   { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
  langBtn: {
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: COLORS.surface2,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  langTxt: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
});

registerRootComponent(App);
