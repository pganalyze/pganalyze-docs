import React, { useLayoutEffect, useState, useContext } from 'react'

const PasswordLen = 16;
const PasswordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const STORAGE_KEY = 'pganalyze_generated_password';
const MAX_AGE_MS = 48 * 60 * 60 * 1000; // 48 hours

function generatePassword () {
  return Array.from(window.crypto.getRandomValues(new Uint32Array(PasswordLen)))
    .map((x) => PasswordChars[x % PasswordChars.length])
    .join('')
}

function getOrCreatePassword(): string {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { password, createdAt } = JSON.parse(stored);
      if (password && createdAt && Date.now() - createdAt < MAX_AGE_MS) {
        return password;
      }
    }
  } catch {
    // sessionStorage unavailable or corrupt — fall through
  }
  const password = generatePassword();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ password, createdAt: Date.now() }));
  } catch {
    // ignore storage errors
  }
  return password;
}

const DEFAULT_PASSWORD = "mypassword";

const GeneratedPasswordContext = React.createContext(DEFAULT_PASSWORD);

const WithGeneratedPassword = ({children}: { children: React.ReactNode }) => {
  const [ password, setPassword ] = useState('[could not generate password]');
  useLayoutEffect(() => {
    // ensure the password is generated during client-side rendering, to avoid
    // generating a single recommended password for everyone at build time
    setPassword(getOrCreatePassword());
  }, [])
  return (
    <GeneratedPasswordContext.Provider value={password}>
      {children}
    </GeneratedPasswordContext.Provider>
  );
}

export const useGeneratedPassword = () => {
  const contextValue = useContext(GeneratedPasswordContext);
  const [password, setPassword] = useState(contextValue);
  useLayoutEffect(() => {
    // If no provider is present (contextValue is the default), generate a
    // password from sessionStorage. This allows the hook to work without
    // WithGeneratedPassword wrapping the tree (e.g., in Astro SSR pages).
    if (contextValue === DEFAULT_PASSWORD && typeof window !== 'undefined') {
      setPassword(getOrCreatePassword());
    } else {
      setPassword(contextValue);
    }
  }, [contextValue]);
  return password;
}

export default WithGeneratedPassword;
