import React, { useLayoutEffect, useState, useContext } from 'react'

const PasswordLen = 16;
const PasswordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

function generatePassword () {
  return Array.from(window.crypto.getRandomValues(new Uint32Array(PasswordLen)))
    .map((x) => PasswordChars[x % PasswordChars.length])
    .join('')
}

const GeneratedPasswordContext = React.createContext("mypassword");

const WithGeneratedPassword = ({children}: { children: React.ReactNode }) => {
  const [ password, setPassword ] = useState('[could not generate password]');
  useLayoutEffect(() => {
    // ensure the password is generated during client-side rendering, to avoid
    // generating a single recommended password for everyone at build time
    setPassword(generatePassword());
  }, [])
  return (
    <GeneratedPasswordContext.Provider value={password}>
      {children}
    </GeneratedPasswordContext.Provider>
  );
}

export const useGeneratedPassword = () => {
  return useContext(GeneratedPasswordContext);
}

export default WithGeneratedPassword;
