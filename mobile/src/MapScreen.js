import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, SEV_COLOR, SEV_BG, SEV_LABEL, STATUS_CFG, timeAgo } from './data';

const INDIA = {
  latitude: 20.5937, longitude: 78.9629,
  latitudeDelta: 18, longitudeDelta: 18,
};

// forwardRef so App.js can call flyTo(report) on this screen
const MapScreen = forwardRef(function MapScreen({ reports, onOpenReport }, ref) {
  const mapRef  = useRef(null);
  const [locating, setLocating]   = useState(false);
  const [hintGone, setHintGone]   = useState(false);

  // Expose flyTo to parent
  useImperativeHandle(ref, () => ({
    flyTo(r) {
      mapRef.current?.animateToRegion({
        latitude: r.lat, longitude: r.lng,
        latitudeDelta: 0.04, longitudeDelta: 0.04,
      }, 700);
      setTimeout(() => {
        // open the callout — find marker by triggering openReport so popup shows
      }, 800);
    },
  }));

  async function goToMe() {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { Alert.alert('Permission denied', 'Location access is needed.'); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude, longitude: loc.coords.longitude,
        latitudeDelta: 0.05, longitudeDelta: 0.05,
      }, 600);
    } catch { Alert.alert('Error', 'Could not get your location.'); }
    finally { setLocating(false); }
  }

  function handleMapPress(e) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setHintGone(true);
    // Pass coords as a "pre-filled" new report
    onOpenReport(null, { lat: latitude, lng: longitude });
  }

  return (
    <View style={s.container}>
      <MapView
        ref={mapRef}
        style={s.map}
        initialRegion={INDIA}
        showsUserLocation
        onPress={handleMapPress}
      >
        {reports.map(r => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat, longitude: r.lng }}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={[s.pin, { backgroundColor: SEV_COLOR[r.severity] }]} />

            <Callout tooltip onPress={() => onOpenReport(r)}>
              <View style={s.callout}>
                <View style={s.calloutRow}>
                  <View style={[s.sevChip, { backgroundColor: SEV_BG[r.severity] }]}>
                    <Text style={[s.sevChipTxt, { color: SEV_COLOR[r.severity] }]}>
                      {SEV_LABEL[r.severity]}
                    </Text>
                  </View>
                  <View style={[s.dot, { backgroundColor: STATUS_CFG[r.status].dot }]} />
                  <Text style={s.statusTxt}>{r.status}</Text>
                </View>
                <Text style={s.calloutAddr} numberOfLines={1}>{r.address}</Text>
                <Text style={s.calloutDesc} numberOfLines={2}>{r.description}</Text>
                <Text style={s.calloutTime}>{timeAgo(r.timestamp)}</Text>
                {r.status !== 'Cleaned' && (
                  <TouchableOpacity style={s.calloutBtn} onPress={() => onOpenReport(r)}>
                    <Text style={s.calloutBtnTxt}>
                      {r.status === 'Reported' ? 'Claim Cleanup' : 'Mark Cleaned'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Map hint */}
      {!hintGone && (
        <TouchableOpacity style={s.hint} onPress={() => setHintGone(true)} activeOpacity={0.8}>
          <Text style={s.hintTxt}>📍 Tap anywhere on the map to report a spot</Text>
        </TouchableOpacity>
      )}

      {/* Legend */}
      <View style={s.legend}>
        <Text style={s.legendTitle}>📍 Garbage Spots</Text>
        <View style={s.legendRow}>
          {['low','medium','high'].map(sv => (
            <View key={sv} style={[s.legTag, { backgroundColor: SEV_BG[sv] }]}>
              <Text style={[s.legTxt, { color: SEV_COLOR[sv] }]}>● {SEV_LABEL[sv]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* My location */}
      <TouchableOpacity style={s.locBtn} onPress={goToMe} activeOpacity={0.8}>
        {locating
          ? <ActivityIndicator size="small" color={COLORS.green} />
          : <Text style={s.locIcon}>◎</Text>}
      </TouchableOpacity>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => onOpenReport(null)} activeOpacity={0.85}>
        <Text style={s.fabPlus}>＋</Text>
        <Text style={s.fabLabel}>Report Spot</Text>
      </TouchableOpacity>
    </View>
  );
});

export default MapScreen;

const s = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  pin: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  callout: {
    width: 230, backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 12,
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  calloutRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  sevChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  sevChipTxt: { fontSize: 11, fontWeight: '600' },
  dot: { width: 7, height: 7, borderRadius: 4, marginLeft: 2 },
  statusTxt: { fontSize: 11, color: COLORS.textSecondary },
  calloutAddr: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  calloutDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16, marginBottom: 5 },
  calloutTime: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  calloutBtn: { backgroundColor: COLORS.green, borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  calloutBtnTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },

  hint: {
    position: 'absolute', bottom: 90, alignSelf: 'center',
    backgroundColor: 'rgba(26,25,23,0.82)',
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 24,
  },
  hintTxt: { color: '#fff', fontSize: 12, fontWeight: '500' },

  legend: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 10,
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  legendTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  legendRow: { flexDirection: 'row', gap: 5 },
  legTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  legTxt: { fontSize: 10, fontWeight: '600' },

  locBtn: {
    position: 'absolute', top: 14, left: 14,
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  locIcon: { fontSize: 20, color: COLORS.green },

  fab: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 28, paddingVertical: 13, paddingHorizontal: 22, gap: 6,
    shadowColor: COLORS.green, shadowOpacity: 0.45,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  fabPlus: { color: '#fff', fontSize: 20, lineHeight: 22 },
  fabLabel: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
