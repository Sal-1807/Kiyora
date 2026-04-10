import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';

import { COLORS, SEED_REPORTS } from './src/data';
import MapScreen from './src/MapScreen';
import ListScreen from './src/ListScreen';
import ReportModal from './src/ReportModal';
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

function TabIcon({ label, focused }) {
  const map = { Map: '🗺️', Reports: '📋' };
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

function App() {
  const [reports, setReports]       = useState(SEED_REPORTS);
  const [modalVisible, setModal]    = useState(false);
  const [selected, setSelected]     = useState(null);   // existing report
  const [prefillCoords, setPrefill] = useState(null);   // from map tap

  const mapRef  = useRef(null);   // ref to MapScreen (exposes flyTo)
  const navRef  = useNavigationContainerRef();
  const { message: toastMsg, opacity: toastOpacity, showToast } = useToast();

  // Open detail sheet OR new-report form
  // coords is set when user tapped the map
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

  const handleSubmit = useCallback(data => {
    setReports(prev => [{
      id: `r${Date.now()}`,
      status: 'Reported',
      timestamp: new Date(),
      ...data,
    }, ...prev]);
    showToast('📍 Report submitted! Thank you.');
  }, [showToast]);

  const handleAction = useCallback((id, action) => {
    setReports(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, status: action === 'claim' ? 'In Progress' : 'Cleaned' };
    }));
    showToast(action === 'claim'
      ? '🔧 Cleanup claimed! You\'re making a difference.'
      : '✅ Marked as cleaned! Great work.');
  }, [showToast]);

  // Called from ListScreen "View" button — switch to Map tab + fly to report
  const handleFlyTo = useCallback(r => {
    navRef.current?.navigate('Map');
    setTimeout(() => {
      mapRef.current?.flyTo(r);
    }, 300);
  }, [navRef]);

  const stats = {
    high:    reports.filter(r => r.severity === 'high' && r.status !== 'Cleaned').length,
    cleaned: reports.filter(r => r.status === 'Cleaned').length,
  };

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
                height: Platform.OS === 'ios' ? 80 : 60,
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
            <Tab.Screen name="Reports" options={{ title: 'Reports' }}>
              {() => (
                <ListScreen
                  reports={reports}
                  onOpenReport={openReport}
                  onFlyTo={handleFlyTo}
                />
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
        />

        <Toast message={toastMsg} opacity={toastOpacity} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const hs = StyleSheet.create({
  row:      { flexDirection: 'row', gap: 6, paddingRight: 14 },
  badge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
});

registerRootComponent(App);
