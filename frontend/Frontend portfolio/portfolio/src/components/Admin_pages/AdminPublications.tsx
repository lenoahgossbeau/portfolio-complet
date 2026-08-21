"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/locales/translations";

// ✅ Import mis à jour pour inclure updatePublication
import {
  fetchPublications,
  fetchPublication,
  deletePublication,
  updatePublication,
  fetchUsers,
  Publication,
  User,
} from "@/lib/adminApi";

import PublicationForm from "@/components/Brice_Component/PublicationForm";

export default function AdminPublications() {
  const { language } = useLanguage();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // ✅ Nouvel état pour la publication sélectionnée
  const [selectedPublication, setSelectedPublication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  // ✅ Nouvel état pour la publication en cours d'édition
  const [editingPublication, setEditingPublication] = useState<any | null>(null);
  
  // ✅ Nouveaux états pour les champs du formulaire d'édition
  const [editTitle, setEditTitle] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editJournal, setEditJournal] = useState("");
  const [editDoi, setEditDoi] = useState("");

  // ===============================
  // Chargement des données
  // ===============================

  const loadData = async () => {
    try {
      setLoading(true);

      const [publicationsData, usersData] = await Promise.all([
        fetchPublications(),
        fetchUsers(),
      ]);

      console.log("PUBLICATIONS =", publicationsData);
      console.log("USERS =", usersData);

      setPublications(publicationsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Erreur chargement publications :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===============================
  // Voir une publication
  // ===============================
  const handleView = async (id: number) => {
    const publication = await fetchPublication(id);

    if (!publication) {
      alert(t("publication_fetch_error", language));
      return;
    }

    setSelectedPublication(publication);
  };

  // ===============================
  // Modifier une publication
  // ===============================
  const handleEdit = async (id: number) => {
    const publication = await fetchPublication(id);

    if (!publication) {
      alert(t("publication_fetch_error", language));
      return;
    }

    setEditingPublication(publication);
    
    // ✅ Remplissage des champs avec les données de la publication
    setEditTitle(publication.title || "");
    setEditYear(publication.year ? String(publication.year) : "");
    setEditJournal(publication.journal || "");
    setEditDoi(publication.doi || "");
  };

  // ===============================
  // Suppression
  // ===============================

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        t("publication_delete_confirm", language)
      )
    ) {
      return;
    }

    const success = await deletePublication(id);

    if (success) {
      setPublications((prev) =>
        prev.filter((publication) => publication.id !== id)
      );
    } else {
      alert(t("publication_delete_error", language));
    }
  };

  // ===============================
  // Après création
  // ===============================

  const handlePublicationCreated = async () => {
    setShowCreateForm(false);

    await loadData();
  };

  // ===============================
  // Enregistrer la modification
  // ===============================
  const handleUpdate = async () => {
    if (!editingPublication) {
      return;
    }

    const result = await updatePublication(
      editingPublication.id,
      {
        title: editTitle,
        year: Number(editYear),
        journal: editJournal || undefined,
        doi: editDoi || undefined,
      }
    );

    if (!result) {
      alert(t("publication_update_error", language));
      return;
    }

    alert(t("publication_updated", language));

    setEditingPublication(null);

    await loadData();
  };

  return (
    <div className="mt-8">

      {/* ===============================
          EN-TÊTE
      =============================== */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          {t("publications_title", language)}
        </h2>

        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + {t("new_publication", language)}
        </button>

      </div>

      {/* ===============================
          FORMULAIRE DE CRÉATION
      =============================== */}

      {showCreateForm && (
        <PublicationForm
          users={users}
          onCancel={() => setShowCreateForm(false)}
          onCreated={handlePublicationCreated}
        />
      )}

      {/* ===============================
          TABLEAU
      =============================== */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            {t("loading_publications", language)}
          </div>
        ) : publications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t("no_data", language)}
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">
                  {t("title", language)}
                </th>

                <th className="text-left p-4">
                  {t("researcher", language)}
                </th>

                <th className="text-left p-4">
                  {t("year", language)}
                </th>

                <th className="text-left p-4">
                  {t("journal", language)}
                </th>

                <th className="text-left p-4">
                  {t("doi", language)}
                </th>

                <th className="text-center p-4">
                  {t("action", language)}
                </th>

              </tr>

            </thead>

            <tbody>

              {publications.map((pub) => (

                <tr
                  key={pub.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {pub.title}
                  </td>

                  <td className="p-4">
                    {pub.researcher}
                  </td>

                  <td className="p-4">
                    {pub.year}
                  </td>

                  <td className="p-4">
                    {pub.journal || "-"}
                  </td>

                  <td className="p-4">
                    {pub.doi || "-"}
                  </td>

                  <td className="p-4 text-center">

                    <div className="flex justify-center gap-3">

                      {/* ✅ Bouton Voir connecté */}
                      <button
                        onClick={() => handleView(pub.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {t("detail", language)}
                      </button>

                      {/* ✅ Bouton Modifier connecté */}
                      <button
                        onClick={() => handleEdit(pub.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        {t("edit", language)}
                      </button>

                      <button
                        onClick={() => handleDelete(pub.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {t("delete", language)}
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* ===============================
          FENÊTRE DÉTAILS (PUBLICATION)
      =============================== */}

      {selectedPublication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {t("detail", language)}
              </h3>

              <button
                onClick={() => setSelectedPublication(null)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  {t("title", language)}
                </p>
                <p className="font-semibold">
                  {selectedPublication.title}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("researcher", language)}
                </p>
                <p>
                  {selectedPublication.profile?.first_name}{' '}
                  {selectedPublication.profile?.last_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("year", language)}
                </p>
                <p>{selectedPublication.year}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("journal_conference", language)}
                </p>
                <p>{selectedPublication.journal || t("not_specified", language)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("doi", language)}
                </p>
                <p>{selectedPublication.doi || t("not_specified", language)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("description", language)}
                </p>
                <p className="text-gray-700">
                  {selectedPublication.description || t("no_description", language)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  {t("link", language)}
                </p>

                {selectedPublication.link ? (
                  <a
                    href={selectedPublication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {t("open_publication", language)}
                  </a>
                ) : (
                  <p>{t("not_specified", language)}</p>
                )}
              </div>

            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedPublication(null)}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                {t("close", language)}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===============================
          FENÊTRE MODIFICATION (PUBLICATION)
      =============================== */}

      {editingPublication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {t("edit", language)}
              </h3>

              <button
                onClick={() => setEditingPublication(null)}
                className="text-gray-500 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {t("title", language)}
                </label>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {t("year", language)}
                </label>

                <input
                  type="number"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {t("journal_conference", language)}
                </label>

                <input
                  type="text"
                  value={editJournal}
                  onChange={(e) => setEditJournal(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  {t("doi", language)}
                </label>

                <input
                  type="text"
                  value={editDoi}
                  onChange={(e) => setEditDoi(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setEditingPublication(null)}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                {t("cancel", language)}
              </button>

              {/* ✅ Bouton Enregistrer connecté à handleUpdate */}
              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t("save", language)}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}