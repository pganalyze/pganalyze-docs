import { ReactNode, useLayoutEffect, useState } from 'react'

const PasswordLen = 16;
const PasswordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

function generatePassword () {
  return Array.from(window.crypto.getRandomValues(new Uint32Array(PasswordLen)))
    .map((x) => PasswordChars[x % PasswordChars.length])
    .join('')
}

const GeneratePassword: (props: {children: (pwd: string) => ReactNode}) => ReactNode = ({children}) => {
  const [ password, setPassword ] = useState('[could not generate password]');
  useLayoutEffect(() => {
    setPassword(generatePassword());
  }, [])
  return children(password);
}

export default GeneratePassword;