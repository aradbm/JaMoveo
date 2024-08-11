export const decryptPassword = (encryptedPassword: string): string => {
  // The atob function decodes a string of data which has been encoded using base-64 encoding.
  return atob(encryptedPassword);
};
