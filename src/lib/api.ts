// Utiliser l'URL de production si on est sur Render
const isProduction = process.env.NODE_ENV === "production";
const PROD_API_URL = "https://portfolio-api-3886.onrender.com";
const DEV_API_URL = "http://localhost:8000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (isProduction ? PROD_API_URL : DEV_API_URL);

export const API_ENDPOINTS = {
  publications: `${API_BASE_URL}/publications/`,
  projects: `${API_BASE_URL}/projects/`,
  distinctions: `${API_BASE_URL}/distinctions`,
  academic_career: `${API_BASE_URL}/academic-career`,
  subscriptions: `${API_BASE_URL}/subscriptions/`,
  adminSubscriptions: `${API_BASE_URL}/admin/subscriptions/`,
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
  refresh: `${API_BASE_URL}/auth/refresh`,
  lang: (lang: string) => `${API_BASE_URL}/lang/${lang}`,
  health: `${API_BASE_URL}/health`,
  info: `${API_BASE_URL}/api/info`,
  profile: `${API_BASE_URL}/profiles`,
};

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("access_token");

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Pour FormData, laisser le navigateur définir automatiquement Content-Type
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/auth/login";
    throw new Error("Session expirée");
  }

  return response;
}

// ===================== AUTH =====================
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login échoué");
  return res.json();
}

export async function logout() {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  });
}

// ===================== PROJECTS =====================
export async function getProjects() {
  const res = await fetch(`${API_BASE_URL}/projects/`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

// ===================== PUBLICATIONS =====================
export async function getPublications() {
  const res = await fetch(`${API_BASE_URL}/publications/`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

// ===================== PROFILE =====================
export async function getProfile(token: string) {
  const res = await fetch(`${API_BASE_URL}/profiles/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Profil introuvable");
  return res.json();
}

// ===================== ACADEMIC CAREER =====================
export async function getAcademicCareer() {
  const res = await fetch(`${API_BASE_URL}/academic-career/`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

// ===================== DISTINCTIONS =====================
export async function getDistinctions() {
  const res = await fetch(`${API_BASE_URL}/distinctions/`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

// ===================== COURS =====================
export async function getCours() {
  const res = await fetch(`${API_BASE_URL}/cours/`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

// ===================== DASHBOARD ADMIN =====================
export async function getDashboardStats(token: string) {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Dashboard inaccessible");
  return res.json();
}