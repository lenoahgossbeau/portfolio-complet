'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SlugPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page publique du chercheur avec le slug
    router.push(`/researcher/public/slug/${params.slug}`);
  }, [params.slug, router]);

  return <div>Redirection vers le chercheur...</div>;
}