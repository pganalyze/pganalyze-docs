const PasswordLen = 16;
const PasswordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

export function generatePassword () {
  return Array.from(crypto.getRandomValues(new Uint32Array(PasswordLen)))
    .map((x) => PasswordChars[x % PasswordChars.length])
    .join('')
}
  