export const encryptPassword = (password: string): string => {
  return btoa(password);
};
