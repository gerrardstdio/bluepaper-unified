const KEY = "admin123";

export function getAdminPassword() {
  return sessionStorage.getItem(KEY) || "";
}

export function setAdminPassword(pw) {
  sessionStorage.setItem(KEY, pw);
}

export function clearAdminPassword() {
  sessionStorage.removeItem(KEY);
}

export async function adminFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "x-admin-password": getAdminPassword(),
    ...(options.headers || {}),
  };
  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText);
    err.status = res.status;
    throw err;
  }
  return data;
}
