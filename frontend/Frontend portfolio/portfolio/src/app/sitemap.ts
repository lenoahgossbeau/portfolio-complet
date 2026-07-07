import { API_BASE_URL } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = 'https://inchtechs.com';

  let researchers = [];
  try {
    const res = await fetch(`${API_BASE_URL}/researchers`);
    if (res.ok) {
      researchers = await res.json();
    }
  } catch (error) {
    console.error('Erreur chargement chercheurs pour sitemap:', error);
  }

  const researcherUrls = researchers.map((researcher: any) => ({
    url: `${baseUrl}/researcher/public/${researcher.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...researcherUrls];
}