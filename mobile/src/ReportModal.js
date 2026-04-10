import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, ScrollView, Image, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SEV_COLOR, SEV_BG, SEV_LABEL, STATUS_CFG } from './data';

export default function ReportModal({ visible, report, onClose, onSubmit, onAction }) {
  const isNew = !report;

  // New-report form state
  const [desc, setDesc]         = useState('');
  const [severity, setSeverity] = useState('medium');
  const [image, setImage]       = useState(null);
  const [coords, setCoords]     = useState(null);
  const [address, setAddress]   = useState('');
  const [locating, setLocating] = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (visible && isNew) {
      setDesc(''); setSeverity('medium'); setImage(null);
      setCoords(null); setAddress('');
      grabLocation();
    }
  }, [visible]);

  async function grabLocation() {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude, longitude: loc.coords.longitude,
      });
      if (place) setAddress([place.street, place.district, place.city].filter(Boolean).join(', '));
    } catch { /* silently ignore */ }
    finally { setLocating(false); }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Photo library access required.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6, allowsEditing: true, aspect: [4,3],
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Camera access required.'); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true, aspect: [4,3] });
    if (!res.canceled) setImage(res.assets[0].uri);
  }

  function handleSubmit() {
    if (!desc.trim()) { Alert.alert('Missing info', 'Please describe the garbage spot.'); return; }
    setSaving(true);
    setTimeout(() => {
      onSubmit({
        description: desc.trim(), severity, image,
        lat: coords?.lat ?? 20.5937 + (Math.random() - 0.5) * 2,
        lng: coords?.lng ?? 78.9629 + (Math.random() - 0.5) * 2,
        address: address || 'Unknown location',
      });
      setSaving(false);
      onClose();
    }, 300);
  }

  // ─── Detail view for an existing report ──────────────────────────────────
  if (!isNew && report) {
    const cfg = STATUS_CFG[report.status];
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.detailHeader}>
            <View style={[s.iconBox, { backgroundColor: cfg.iconBg }]}>
              <Text style={s.iconTxt}>{cfg.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.detailAddr}>{report.address}</Text>
              <View style={s.row}>
                <View style={[s.sevChip, { backgroundColor: SEV_BG[report.severity] }]}>
                  <Text style={[s.sevChipTxt, { color: SEV_COLOR[report.severity] }]}>
                    {SEV_LABEL[report.severity]}
                  </Text>
                </View>
                <View style={[s.dot, { backgroundColor: cfg.dot }]} />
                <Text style={s.statusTxt}>{report.status}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.detailBody} showsVerticalScrollIndicator={false}>
            <Text style={s.detailDesc}>{report.description}</Text>
            {report.image && <Image source={{ uri: report.image }} style={s.detailImg} />}
          </ScrollView>

          {report.status !== 'Cleaned' && (
            <View style={s.detailActions}>
              {report.status === 'Reported' && (
                <TouchableOpacity
                  style={[s.bigBtn, { backgroundColor: COLORS.orange }]}
                  onPress={() => { onAction(report.id, 'claim'); onClose(); }}
                >
                  <Text style={s.bigBtnTxt}>♻️  Claim Cleanup</Text>
                </TouchableOpacity>
              )}
              {report.status === 'In Progress' && (
                <TouchableOpacity
                  style={[s.bigBtn, { backgroundColor: COLORS.green }]}
                  onPress={() => { onAction(report.id, 'clean'); onClose(); }}
                >
                  <Text style={s.bigBtnTxt}>✅  Mark as Cleaned</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
    );
  }

  // ─── New report form ──────────────────────────────────────────────────────
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.formHeader}>
            <Text style={s.formTitle}>Report a Spot</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.formBody} showsVerticalScrollIndicator={false}>

            {/* Location */}
            <Text style={s.label}>Location</Text>
            <View style={s.locBox}>
              {locating
                ? <ActivityIndicator size="small" color={COLORS.green} style={{ marginRight: 8 }} />
                : <Text style={{ fontSize: 15, marginRight: 8 }}>📍</Text>}
              <Text style={s.locTxt} numberOfLines={1}>
                {locating ? 'Getting location…' : address || 'Location unavailable'}
              </Text>
            </View>

            {/* Severity */}
            <Text style={s.label}>Severity</Text>
            <View style={s.sevRow}>
              {['low','medium','high'].map(sv => (
                <TouchableOpacity
                  key={sv}
                  style={[s.sevOpt, { borderColor: SEV_COLOR[sv] }, severity === sv && { backgroundColor: SEV_BG[sv] }]}
                  onPress={() => setSeverity(sv)}
                >
                  <Text style={[s.sevOptTxt, { color: SEV_COLOR[sv] }]}>{SEV_LABEL[sv]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Description */}
            <Text style={s.label}>Description</Text>
            <TextInput
              style={s.textArea}
              multiline numberOfLines={4}
              placeholder="Describe the garbage spot — type of waste, size, hazard level…"
              placeholderTextColor={COLORS.textMuted}
              value={desc} onChangeText={setDesc}
              textAlignVertical="top"
            />

            {/* Photo */}
            <Text style={s.label}>Photo (optional)</Text>
            {image ? (
              <View>
                <Image source={{ uri: image }} style={s.preview} />
                <TouchableOpacity style={s.removeImg} onPress={() => setImage(null)}>
                  <Text style={s.removeImgTxt}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s.photoRow}>
                <TouchableOpacity style={s.photoBtn} onPress={takePhoto}>
                  <Text style={{ fontSize: 22 }}>📷</Text>
                  <Text style={s.photoBtnTxt}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.photoBtn} onPress={pickImage}>
                  <Text style={{ fontSize: 22 }}>🖼️</Text>
                  <Text style={s.photoBtnTxt}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={s.submitWrap}>
            <TouchableOpacity
              style={[s.submitBtn, saving && { opacity: 0.7 }]}
              onPress={handleSubmit} disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.submitTxt}>Submit Report</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: COLORS.bg },
  handle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: COLORS.border,
    alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },

  // Detail
  detailHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconTxt: { fontSize: 22 },
  detailAddr: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sevChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  sevChipTxt: { fontSize: 11, fontWeight: '600' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 12, color: COLORS.textSecondary },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 16, color: COLORS.textMuted },
  detailBody: { flex: 1, padding: 16 },
  detailDesc: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },
  detailImg: { width: '100%', height: 200, borderRadius: 12, marginTop: 16 },
  detailActions: {
    padding: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  bigBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  bigBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Form
  formHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  formTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  formBody: { flex: 1, padding: 16 },

  label: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 8, marginTop: 16,
  },

  locBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 10,
    padding: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  locTxt: { flex: 1, fontSize: 13, color: COLORS.textSecondary },

  sevRow: { flexDirection: 'row', gap: 10 },
  sevOpt: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 2, alignItems: 'center', backgroundColor: COLORS.surface,
  },
  sevOptTxt: { fontSize: 13, fontWeight: '700' },

  textArea: {
    backgroundColor: COLORS.surface, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 12, fontSize: 14, color: COLORS.textPrimary, minHeight: 100,
  },

  photoRow: { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 18, alignItems: 'center', gap: 6,
  },
  photoBtnTxt: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  preview: { width: '100%', height: 180, borderRadius: 12 },
  removeImg: { marginTop: 8, alignItems: 'center' },
  removeImgTxt: { fontSize: 13, color: COLORS.red, fontWeight: '600' },

  submitWrap: {
    padding: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.green, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
    shadowColor: COLORS.green, shadowOpacity: 0.35,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  submitTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
