import React, { useState, useCallback, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { COLORS } from './data';

// Hook — call showToast('message') anywhere you have the ref
export function useToast() {
  const [message, setMessage] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer   = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    clearTimeout(timer.current);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2400),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [opacity]);

  return { message, opacity, showToast };
}

// Component — place once at the root level
export function Toast({ message, opacity }) {
  if (!message) return null;
  return (
    <Animated.View style={[s.toast, { opacity }]} pointerEvents="none">
      <Text style={s.txt}>{message}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#1A1917',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    zIndex: 9999,
    maxWidth: '80%',
  },
  txt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
