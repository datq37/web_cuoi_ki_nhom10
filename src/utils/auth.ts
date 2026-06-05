export const hasLoginToken = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('loginToken'));
};
