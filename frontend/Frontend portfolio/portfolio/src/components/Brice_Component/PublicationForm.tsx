"use client";

import { useState } from "react";
import { createPublication } from "@/lib/adminApi";
import type { User } from "@/lib/adminApi";

interface PublicationFormProps {
  users: User[];
  onCancel: () => void;
  onCreated: () => void;
}

export default function PublicationForm({
  users,
  onCancel,
  onCreated,
}: PublicationFormProps) {
  const [profileId, setProfileId] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [coauthor, setCoauthor] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!profileId) {
      setError("Veuillez sélectionner un chercheur.");
      return;
    }

    if (!title.trim()) {
      setError("Veuillez saisir le titre de la publication.");
      return;
    }

    if (!year) {
      setError("Veuillez saisir l'année de publication.");
      return;
    }

    const yearNumber = Number(year);

    if (yearNumber < 1900 || yearNumber > 2100) {
      setError("L'année doit être comprise entre 1900 et 2100.");
      return;
    }

    const coauthorList = coauthor
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    try {
      setLoading(true);

      const result = await createPublication({
        profile_id: Number(profileId),
        year: yearNumber,
        title: title.trim(),
        coauthor: coauthorList,
        journal: journal.trim() || undefined,
        doi: doi.trim() || undefined,
      });

      if (!result) {
        setError("La création de la publication a échoué.");
        return;
      }

      onCreated();
    } catch (err) {
      console.error("Erreur création publication :", err);
      setError("Une erreur est survenue lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Nouvelle publication
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Chercheur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chercheur *
          </label>

          <select
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              Sélectionner un chercheur
            </option>

            {users
              .filter((user) => user.profile)
              .map((user) => (
                <option
                  key={user.profile!.id}
                  value={user.profile!.id}
                >
                  {user.profile!.first_name} {user.profile!.last_name}
                </option>
              ))}
          </select>

          {users.filter((user) => user.profile).length === 0 && (
            <p className="text-sm text-orange-600 mt-2">
              Aucun profil chercheur disponible.
            </p>
          )}
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la publication"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Année */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Année *
          </label>

          <input
            type="number"
            min="1900"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Co-auteurs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Co-auteurs
          </label>

          <input
            type="text"
            value={coauthor}
            onChange={(e) => setCoauthor(e.target.value)}
            placeholder="Jean Dupont, Alice Martin, Paul Bernard"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-xs text-gray-500 mt-1">
            Séparez les noms par des virgules.
          </p>
        </div>

        {/* Journal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Journal / Conférence
          </label>

          <input
            type="text"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Nom du journal ou de la conférence"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* DOI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DOI
          </label>

          <input
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="10.1234/example.2026.001"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer la publication"}
          </button>

        </div>
      </form>
    </div>
  );
}