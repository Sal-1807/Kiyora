import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// In-memory user store (persists for the app session)
let _users = [];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function signup({ name, email, password, role }) {
    const existing = _users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return { error: 'Email already registered.' };
    const newUser = { name, email, password, role };
    _users.push(newUser);
    setUser({ name, email, role });
    return { ok: true };
  }

  function login({ email, password }) {
    const found = _users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return { error: 'Invalid email or password.' };
    setUser({ name: found.name, email: found.email, role: found.role });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
