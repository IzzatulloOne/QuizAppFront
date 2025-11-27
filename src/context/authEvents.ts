// context/authEvents.ts
let logoutFn: (() => void) | null = null;

export const registerLogoutCallback = (fn: () => void) => {
  logoutFn = fn;
};

export const authLogout = () => {
  if (logoutFn) logoutFn();
};
