import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { COLORS } from './data';
import { useAuth } from './AuthContext';

export default function AuthScreen() {
  const { signup, login } = useAuth();
  const [role, setRole]       = useState('citizen');
  const [tab, setTab]         = useState('login');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [error, setError]     = useState('');

  function switchTab(next) {
    setTab(next);
    setError('');
    setName(''); setEmail(''); setPass('');
  }

  function handleSubmit() {
    setError('');
    if (!email.trim() || !password.trim()) { setError('Email and password are required.'); return; }
    if (tab === 'signup') {
      if (!name.trim()) { setError('Full name is required.'); return; }
      const res = signup({ name: name.trim(), email: email.trim(), password, role });
      if (res.error) setError(res.error);
    } else {
      const res = login({ email: email.trim(), password });
      if (res.error) setError(res.error);
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo + tagline */}
          <View style={s.logoRow}>
            <Image source={require('../assets/icon.png')} style={s.logo} />
            <Text style={s.logoTxt}>Kiyora</Text>
          </View>
          <Text style={s.tagline}>Report. Clean. Earn points.</Text>

          {/* Role selector */}
          <Text style={s.sectionLabel}>I am a…</Text>
          <View style={s.roleRow}>
            <TouchableOpacity
              style={[s.roleBtn, role === 'citizen' && s.roleBtnActive]}
              onPress={() => setRole('citizen')}
              activeOpacity={0.8}
            >
              <Text style={s.roleIcon}>👤</Text>
              <Text style={[s.roleLbl, role === 'citizen' && s.roleLblActive]}>Citizen</Text>
              <Text style={s.roleDesc}>Report garbage spots</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.roleBtn, role === 'volunteer' && s.roleBtnActive]}
              onPress={() => setRole('volunteer')}
              activeOpacity={0.8}
            >
              <Text style={s.roleIcon}>♻️</Text>
              <Text style={[s.roleLbl, role === 'volunteer' && s.roleLblActive]}>Volunteer</Text>
              <Text style={s.roleDesc}>Claim &amp; clean spots</Text>
            </TouchableOpacity>
          </View>

          {/* Login / Sign Up tabs */}
          <View style={s.tabs}>
            <TouchableOpacity
              style={[s.tab, tab === 'login' && s.tabActive]}
              onPress={() => switchTab('login')}
            >
              <Text style={[s.tabTxt, tab === 'login' && s.tabTxtActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, tab === 'signup' && s.tabActive]}
              onPress={() => switchTab('signup')}
            >
              <Text style={[s.tabTxt, tab === 'signup' && s.tabTxtActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form fields */}
          {tab === 'signup' && (
            <View style={s.field}>
              <Text style={s.fieldLabel}>Full Name</Text>
              <TextInput
                style={s.input}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          )}

          <View style={s.field}>
            <Text style={s.fieldLabel}>Email</Text>
            <TextInput
              style={s.input}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={s.field}>
            <Text style={s.fieldLabel}>Password</Text>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPass}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity style={s.submit} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={s.submitTxt}>
              {tab === 'login' ? 'Login' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.switchLink}
            onPress={() => switchTab(tab === 'login' ? 'signup' : 'login')}
          >
            <Text style={s.switchTxt}>
              {tab === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 24, paddingTop: 52, flexGrow: 1 },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  logo: { width: 46, height: 46, borderRadius: 12 },
  logoTxt: { fontSize: 30, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5 },
  tagline: { fontSize: 14, color: COLORS.textMuted, marginBottom: 32 },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },

  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleBtn: {
    flex: 1, borderRadius: 14, padding: 16, alignItems: 'center', gap: 4,
    backgroundColor: COLORS.surface, borderWidth: 2, borderColor: COLORS.border,
  },
  roleBtnActive: { borderColor: COLORS.green, backgroundColor: COLORS.greenBg },
  roleIcon: { fontSize: 28, marginBottom: 2 },
  roleLbl: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  roleLblActive: { color: COLORS.green },
  roleDesc: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },

  tabs: {
    flexDirection: 'row', backgroundColor: COLORS.surface2,
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  tabTxt: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  tabTxtActive: { color: COLORS.textPrimary, fontWeight: '700' },

  field: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 15, color: COLORS.textPrimary,
  },

  error: {
    color: COLORS.red, fontSize: 13, fontWeight: '500',
    marginBottom: 8, marginTop: -4,
  },

  submit: {
    backgroundColor: COLORS.green, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 6,
    shadowColor: COLORS.green, shadowOpacity: 0.35,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  submitTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },

  switchLink: { marginTop: 20, alignItems: 'center' },
  switchTxt: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
});
