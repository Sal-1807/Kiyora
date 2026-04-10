import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, ScrollView, Image, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from './data';
import { useLang } from './LangContext';

export default function AfterPhotoModal({ visible, report, onClose, onSubmit }) {
  const { t } = useLang();
  const [afterImage, setAfterImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setAfterImage(null);
      setSaving(false);
    }
  }, [visible]);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permNeeded'), t('photoLibAccess'));
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6, allowsEditing: true, aspect: [4, 3],
    });
    if (!res.canceled) setAfterImage(res.assets[0].uri);
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permNeeded'), t('cameraAccess'));
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.6, allowsEditing: true, aspect: [4, 3],
    });
    if (!res.canceled) setAfterImage(res.assets[0].uri);
  }

  function handleSubmit() {
    if (!afterImage) {
      Alert.alert('', t('noAfterPhoto'));
      return;
    }
    setSaving(true);
    setTimeout(() => {
      onSubmit(report.id, afterImage);
      setSaving(false);
    }, 300);
  }

  if (!report) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.sheet}>
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{t('afterTitle')}</Text>
              <Text style={s.sub}>{t('afterSub')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.body} showsVerticalScrollIndicator={false}>

            {/* Before image preview */}
            {report.image && (
              <View style={s.section}>
                <Text style={s.label}>{t('beforeLabel')}</Text>
                <Image source={{ uri: report.image }} style={s.beforeImg} />
              </View>
            )}

            {/* After image upload */}
            <View style={s.section}>
              <Text style={s.label}>{t('afterPhotoLabel')}</Text>

              {afterImage ? (
                <View>
                  <Image source={{ uri: afterImage }} style={s.afterImg} />
                  <View style={s.compareRow}>
                    {report.image && (
                      <>
                        <View style={s.compareThumb}>
                          <Image source={{ uri: report.image }} style={s.thumbImg} />
                          <Text style={s.thumbLabel}>{t('beforeLabel')}</Text>
                        </View>
                        <Text style={s.compareArrow}>→</Text>
                      </>
                    )}
                    <View style={s.compareThumb}>
                      <Image source={{ uri: afterImage }} style={s.thumbImg} />
                      <Text style={[s.thumbLabel, { color: COLORS.green }]}>{t('afterLabel')}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={s.removeBtn} onPress={() => setAfterImage(null)}>
                    <Text style={s.removeTxt}>✕ {t('removePhoto')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={s.photoRow}>
                  <TouchableOpacity style={s.photoBtn} onPress={takePhoto}>
                    <Text style={{ fontSize: 24 }}>📷</Text>
                    <Text style={s.photoBtnTxt}>{t('camera')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.photoBtn} onPress={pickImage}>
                    <Text style={{ fontSize: 24 }}>🖼️</Text>
                    <Text style={s.photoBtnTxt}>{t('gallery')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Footer */}
          <View style={s.footer}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelTxt}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.submitBtn, saving && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={s.submitTxt}>{t('submitCleaned')}</Text>}
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
  header: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  sub:   { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeTxt: { fontSize: 16, color: COLORS.textMuted },

  body: { flex: 1, padding: 16 },
  section: { marginBottom: 16 },
  label: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 8,
  },

  beforeImg: {
    width: '100%', height: 160, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  afterImg: {
    width: '100%', height: 180, borderRadius: 10,
    borderWidth: 2, borderColor: COLORS.green,
  },

  compareRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginTop: 10,
  },
  compareThumb: { flex: 1, alignItems: 'center', gap: 4 },
  thumbImg: {
    width: '100%', height: 80, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  thumbLabel: {
    fontSize: 10, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  compareArrow: { fontSize: 20, color: COLORS.textMuted, flexShrink: 0 },

  photoRow: { flexDirection: 'row', gap: 12 },
  photoBtn: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 20, alignItems: 'center', gap: 6,
  },
  photoBtnTxt: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  removeBtn: { marginTop: 10, alignItems: 'center' },
  removeTxt: { fontSize: 13, color: COLORS.red, fontWeight: '600' },

  footer: {
    flexDirection: 'row', gap: 10,
    padding: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', backgroundColor: COLORS.surface2,
  },
  cancelTxt: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  submitBtn: {
    flex: 2, paddingVertical: 14,
    borderRadius: 12, alignItems: 'center',
    backgroundColor: COLORS.green,
    shadowColor: COLORS.green, shadowOpacity: 0.35,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  submitTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
