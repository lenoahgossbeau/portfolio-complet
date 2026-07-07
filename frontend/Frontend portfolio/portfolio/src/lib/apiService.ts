import { API_ENDPOINTS, fetchWithAuth, API_BASE_URL } from './api';

export async function fetchPublications() {
  const res = await fetchWithAuth(API_ENDPOINTS.publications);
  if (!res.ok) throw new Error('Erreur chargement publications');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetchWithAuth(API_ENDPOINTS.projects);
  if (!res.ok) throw new Error('Erreur chargement projets');
  return res.json();
}

export async function fetchDistinctions() {
  const res = await fetch(API_ENDPOINTS.distinctions);
  if (!res.ok) throw new Error('Erreur chargement distinctions');
  return res.json();
}

export async function fetchAcademicCareer() {
  const res = await fetch(API_ENDPOINTS.academic_career);
  if (!res.ok) throw new Error('Erreur chargement parcours académique');
  return res.json();
}

export async function switchLanguage(lang: string) {
  const res = await fetch(API_ENDPOINTS.lang(lang));
  if (!res.ok) throw new Error('Erreur changement langue');
  return res.json();
}

export async function fetchSubscriptions() {
  const res = await fetchWithAuth(API_ENDPOINTS.adminSubscriptions);
  if (!res.ok) throw new Error('Erreur chargement abonnements');
  return res.json();
}

// Fonction pour envoyer un message de contact
export async function sendContactMessage(name: string, email: string, message: string) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, message }),
  });
  if (!res.ok) throw new Error('Erreur envoi message');
  return res.json();
}