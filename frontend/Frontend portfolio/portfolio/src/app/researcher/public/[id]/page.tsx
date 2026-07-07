'use client';
import { useState, useEffect, use } from 'react';
import { API_BASE_URL } from '@/lib/api';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import Image from 'next/image';

type ResearcherProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profession: string;
  bio: string;
  cvUrl: string;
  avatar: string;
  publications: any[];
  projects: any[];
};

export default function PublicResearcherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);  // 👈 DÉBALLAGE DE LA PROMESSE
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/researcher/public/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        toast.error('Chercheur non trouvé');
      }
    } catch (error) {
      console.error('Erreur chargement profil public:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          recipient_email: profile?.email
        })
      });
      if (res.ok) {
        toast.success('Message envoyé !');
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error('Erreur lors de l\'envoi');
      }
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setSending(false);
    }
  };

  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `${API_BASE_URL}${avatarPath}`;
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!profile) return <div className="text-center py-20">Chercheur non trouvé</div>;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center gap-6">
              {profile.avatar && (
                <Image
                  src={getAvatarUrl(profile.avatar) || ''}
                  alt={profile.firstName}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h1>
                <p className="text-blue-100">{profile.profession}</p>
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-3">Bio</h2>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {profile.cvUrl && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-3">CV</h2>
              <a href={getAvatarUrl(profile.cvUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Télécharger le CV
              </a>
            </div>
          )}

          {profile.publications.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-3">Publications</h2>
              <ul className="space-y-2">
                {profile.publications.map((pub) => (
                  <li key={pub.id}>
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {pub.title} ({pub.year})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.projects.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-3">Projets</h2>
              <ul className="space-y-2">
                {profile.projects.map((proj) => (
                  <li key={proj.id}>
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {proj.title} ({proj.year})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contacter {profile.firstName}</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                required
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Votre email"
                required
                className="w-full border p-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                placeholder="Votre message"
                rows={4}
                required
                className="w-full border p-2 rounded"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {sending ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}