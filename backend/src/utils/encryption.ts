export const decryptPassword = (encryptedPassword: string): string => {
  return atob(encryptedPassword);
};
