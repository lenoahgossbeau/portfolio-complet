import { API_BASE_URL, fetchWithAuth } from './api';

export interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  profile?: {
    first_name: string;
    last_name: string;
    grade: string;
    specialite: string;
  };
}

export interface Subscription {
  id: number;
  username: string;
  email: string;
  amount: number;
  startedAt: string;
  nextBillingDate: string;
  status: string;
}

// Récupérer tous les utilisateurs (CORRIGÉ)
export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/users/`);
    if (!response.ok) {
      console.error('Erreur fetchUsers:', response.status);
      return [];
    }
    const data = await response.json();
    // Gérer les deux formats possibles
    if (data.users && Array.isArray(data.users)) {
      return data.users;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('Exception fetchUsers:', error);
    return [];
  }
}

// Récupérer les statistiques
export async function fetchStats() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) return { totalUsers: 0, activeUsers: 0 };
    return response.json();
  } catch {
    return { totalUsers: 0, activeUsers: 0 };
  }
}

// Récupérer les abonnements
export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/subscriptions/`);
    if (!response.ok) {
      console.error('Erreur fetchSubscriptions:', response.status);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Exception fetchSubscriptions:', error);
    return [];
  }
}

// Créer un utilisateur
export async function createUser(userData: any) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}