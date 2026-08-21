import { API_BASE_URL, fetchWithAuth } from './api';

export interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  profile?: {
    id: number;
    first_name: string;
    last_name: string;
    grade: string;
    specialite: string;
  };
}

export interface Subscription {
  id: number;
  profile_id: number;
  start_date: string;
  end_date: string;
  type: string;
  payment_method: string;
  amount?: number;
}

export interface Publication {
  id: number;
  title: string;
  year: number;
  journal: string;
  doi: string;
  researcher: string;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/users/`);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.users && Array.isArray(data.users)) return data.users;
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('Exception fetchUsers:', error);
    return [];
  }
}

// ✅ Nouvelle fonction pour récupérer les détails d'un utilisateur spécifique
export async function fetchUserDetails(userId: number) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/users/${userId}`
    );

    if (!response.ok) {
      console.error(
        "Erreur fetchUserDetails:",
        response.status
      );
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Exception fetchUserDetails:",
      error
    );
    return null;
  }
}

export async function fetchStats() {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) return { totalUsers: 0, activeUsers: 0 };
    return response.json();
  } catch {
    return { totalUsers: 0, activeUsers: 0 };
  }
}

export async function fetchSubscriptions(): Promise<Subscription[]> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/subscriptions/`);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Exception fetchSubscriptions:', error);
    return [];
  }
}

export async function createUser(userData: any) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}

export async function deleteUser(userId: number): Promise<boolean> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
    });
    return response.ok || response.status === 204;
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    return false;
  }
}

export async function changeUserStatus(
  userId: number,
  active: boolean
): Promise<boolean> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/users/${userId}/status?active=${active}`,
      {
        method: 'PUT',
      }
    );

    if (!response.ok) {
      console.error('Erreur changeUserStatus:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur changeUserStatus:', error);
    return false;
  }
}

// ✅ AJOUT DE LA FONCTION POUR RÉCUPÉRER LES PUBLICATIONS
export async function fetchPublications(): Promise<Publication[]> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/publications`
    );

    if (!response.ok) return [];

    return response.json();
  } catch (error) {
    console.error("Erreur fetchPublications:", error);
    return [];
  }
}

// ✅ AJOUT DE LA FONCTION POUR SUPPRIMER UNE PUBLICATION
export async function deletePublication(
  publicationId: number
): Promise<boolean> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/publications/${publicationId}`,
      {
        method: "DELETE",
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Erreur deletePublication:", error);
    return false;
  }
}

// =====================================================
// CRÉER UNE PUBLICATION
// =====================================================
export interface PublicationCreateData {
  profile_id: number;
  year: number;
  title: string;
  coauthor: string[];
  journal?: string;
  doi?: string;
}

export async function createPublication(
  publicationData: PublicationCreateData
) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/publications/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publicationData),
      }
    );

    if (!response.ok) {
      console.error(
        'Erreur createPublication:',
        response.status
      );

      return null;
    }

    return await response.json();

  } catch (error) {
    console.error(
      'Exception createPublication:',
      error
    );

    return null;
  }
}

// =====================================================
// VOIR UNE PUBLICATION
// =====================================================
export async function fetchPublication(
  publicationId: number
) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/publications/${publicationId}`
    );

    if (!response.ok) {
      console.error(
        'Erreur fetchPublication:',
        response.status
      );

      return null;
    }

    return await response.json();

  } catch (error) {
    console.error(
      'Exception fetchPublication:',
      error
    );

    return null;
  }
}

// =====================================================
// MODIFIER UNE PUBLICATION
// =====================================================
export interface PublicationUpdateData {
  year?: number;
  title?: string;
  coauthor?: string[];
  journal?: string;
  doi?: string;
  description?: string;
  image?: string;
  link?: string;
}

export async function updatePublication(
  publicationId: number,
  publicationData: PublicationUpdateData
) {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/admin/publications/${publicationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publicationData),
      }
    );

    if (!response.ok) {
      console.error(
        "Erreur updatePublication:",
        response.status
      );

      return null;
    }

    return await response.json();

  } catch (error) {
    console.error(
      "Exception updatePublication:",
      error
    );

    return null;
  }
}