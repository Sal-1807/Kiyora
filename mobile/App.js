import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { COLORS, SEED_REPORTS } from './src/data';
import MapScreen from './src/MapScreen';
import ListScreen from './src/ListScreen';
import ReportModal from './src/ReportModal';

const Tab = createBottomTabNavigator();

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

export default function App() {
  const [reports, setReports] = useState(SEED_REPORTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null); // null = new report

  const openReport  = useCallback(r  => { setSelected(r); setModalVisible(true); }, []);
  const closeModal  = useCallback(()  => { setModalVisible(false); setSelected(null); }, []);

  const handleSubmit = useCallback(data => {
    setReports(prev => [{
      id: `r${Date.now()}`,
      status: 'Reported',
      timestamp: new Date(),
      ...data,
    }, ...prev]);
  }, []);

  const handleAction = useCallback((id, action) => {
    setReports(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, status: action === 'claim' ? 'In Progress' : 'Cleaned' };
    }));
  }, []);

  const stats = {
    high:    reports.filter(r => r.severity === 'high' && r.status !== 'Cleaned').length,
    cleaned: reports.filter(r => r.status === 'Cleaned').length,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerStyle: {
                backgroundColor: COLORS.surface,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
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
            <Tab.Screen name="Map" options={{ title: 'Kiyora' }}>
              {() => <MapScreen reports={reports} onOpenReport={openReport} />}
            </Tab.Screen>
            <Tab.Screen name="Reports" options={{ title: 'Reports' }}>
              {() => <ListScreen reports={reports} onOpenReport={openReport} />}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>

        <ReportModal
          visible={modalVisible}
          report={selected}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onAction={handleAction}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);

const hs = StyleSheet.create({
  row:      { flexDirection: 'row', gap: 6, paddingRight: 14 },
  badge:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeTxt: { fontSize: 11, fontWeight: '600' },
});
