type Translations = {
  [key: string]: {
    fr: string;
    en: string;
  };
};

export const translations: Translations = {
  // Navbar
  'nav_home': { fr: 'Accueil', en: 'Home' },
  'nav_about': { fr: 'À propos', en: 'About' },
  'nav_project': { fr: 'Projet', en: 'Project' },
  'nav_publication': { fr: 'Publication', en: 'Publication' },
  'nav_resume': { fr: 'CV', en: 'Resume' },
  'nav_about_me': { fr: 'À propos de moi', en: 'About me' },
  'nav_contact': { fr: 'Contact', en: 'Contact' },
  'login': { fr: 'Connexion', en: 'Login' },
  'logout': { fr: 'Déconnexion', en: 'Logout' },
  'register': { fr: "S'inscrire", en: 'Register' },
  'software_engineer': { fr: 'Ingénieur logiciel', en: 'Software engineer' },

  // Home page
  'hello_title': { fr: 'Bonjour, je suis', en: "Hello, I'm" },
  'get_in_touch': { fr: 'Me contacter', en: 'Get in touch' },
  'about_summary': {
    fr: 'Un ingénieur logiciel passionné spécialisé dans la création de solutions web modernes, responsives et conviviales.',
    en: 'A passionate software engineer specializing in building modern, responsive, and user-friendly web solutions.'
  },

  // Sections
  'project_section': { fr: 'Projets', en: 'Projects' },
  'publication_section': { fr: 'Publications', en: 'Publications' },
  'resume_section': { fr: 'CV', en: 'Resume' },
  'about_section': { fr: 'À propos', en: 'About' },
  'loading': { fr: 'Chargement...', en: 'Loading...' },
  'view_all': { fr: 'Voir tout', en: 'View All' },
  'show_less': { fr: 'Voir moins', en: 'Show Less' },
  'no_data': { fr: 'Aucune donnée disponible', en: 'No data available' },

  // About section
  'hi_im': { fr: 'Salut, je suis', en: "Hi, I'm" },
  'about_text': {
    fr: "Je suis un ingénieur logiciel passionné par la création de solutions numériques percutantes. Je me concentre sur une architecture propre, des systèmes évolutifs et une conception centrée sur l'utilisateur pour fournir des applications efficaces et modernes. Mon travail combine l'excellence technique avec la créativité pour résoudre des problèmes concrets.",
    en: 'I am a software engineer passionate about building impactful digital solutions. I focus on clean architecture, scalable systems, and user-centered design to deliver efficient and modern applications. My work combines technical excellence with creativity to solve real-world problems.'
  },

  // Buttons
  'create': { fr: 'Créer', en: 'Create' },
  'cancel': { fr: 'Annuler', en: 'Cancel' },
  'save': { fr: 'Enregistrer', en: 'Save' },
  'delete': { fr: 'Supprimer', en: 'Delete' },
  'edit': { fr: 'Modifier', en: 'Edit' },
  'publish': { fr: 'Publier', en: 'Publish' },
  'unpublish': { fr: 'Dépublier', en: 'Unpublish' },
  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'comments': { fr: 'Commentaires', en: 'Comments' },
  'add_comment': { fr: 'Ajouter un commentaire...', en: 'Add a comment...' },
  'delete_comment_confirm': { fr: 'Supprimer ce commentaire ?', en: 'Delete this comment?' },
  'comment_user': { fr: 'Utilisateur', en: 'User' },
  'export': { fr: 'Exporter', en: 'Export' },
  'export_pdf': { fr: 'Exporter PDF', en: 'Export PDF' },
  'exported_on': { fr: 'Exporté le', en: 'Exported on' },
  'export_error': { fr: "Erreur lors de l'export", en: 'Export error' },
  'no_data_to_export': { fr: 'Aucune donnée à exporter', en: 'No data to export' },
  'export_success': { fr: 'Export CSV réussi !', en: 'CSV export successful!' },
  'export_csv_success': { fr: 'Export CSV réussi !', en: 'CSV export successful!' },
  'export_pdf_success': { fr: 'Export PDF réussi !', en: 'PDF export successful!' },

  // Contact
  'contact_name': { fr: 'Nom', en: 'Name' },
  'contact_message': { fr: 'Message', en: 'Message' },
  'contact_send': { fr: 'Envoyer', en: 'Send' },
  'contact_success': { fr: 'Message envoyé avec succès', en: 'Message sent successfully' },

  // Inchtechs / Public pages
  'browse_researchers': { fr: 'Découvrir les chercheurs', en: 'Browse researchers' },
  'welcome_inchtechs': { fr: 'Bienvenue sur InchTechs', en: 'Welcome to InchTechs' },
  'platform_description': { fr: 'Plateforme de portfolios pour chercheurs', en: 'Portfolio platform for researchers' },

  // Suppression
  'delete_confirm': {
    fr: 'Êtes-vous sûr de vouloir supprimer cet abonnement ?',
    en: 'Are you sure you want to delete this subscription?'
  },
  'delete_success': {
    fr: 'Abonnement supprimé avec succès !',
    en: 'Subscription deleted successfully!'
  },
  'delete_error': { fr: 'Erreur lors de la suppression', en: 'Error during deletion' },
  'publish_success': { fr: 'Publié avec succès !', en: 'Published successfully!' },
  'cannot_delete_self': {
    fr: 'Vous ne pouvez pas supprimer votre propre compte',
    en: 'You cannot delete your own account'
  },
  'delete_user_confirm': {
    fr: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    en: 'Are you sure you want to delete this user?'
  },
  'delete_user_success': {
    fr: 'Utilisateur supprimé avec succès !',
    en: 'User deleted successfully!'
  },
  'delete_user_error': {
    fr: "Erreur lors de la suppression de l'utilisateur",
    en: 'Error deleting user'
  },

  // Import contenu
  'import_content': { fr: 'Importer contenu', en: 'Import content' },
  'import_title': { fr: 'Importer le contenu initial', en: 'Import initial content' },
  'import_success': { fr: 'Contenu importé avec succès', en: 'Content imported successfully' },
  'import_error': { fr: "Erreur lors de l'import", en: 'Import error' },
  'importing': { fr: 'Import en cours...', en: 'Importing...' },
  'import': { fr: 'Importer', en: 'Import' },
  'bio': { fr: 'Bio (texte)', en: 'Bio (text)' },
  'bio_placeholder': { fr: 'Description du chercheur...', en: 'Researcher description...' },
  'cv': { fr: 'CV (PDF)', en: 'CV (PDF)' },
  'photo': { fr: 'Photo de profil', en: 'Profile photo' },
  'publications': { fr: 'Publications', en: 'Publications' },
  'projects': { 
    fr: 'Projets',
    en: 'Projects'
  },
  'publications_format': {
    fr: 'Format attendu : [{"title": "...", "date": "...", "description": "...", "link": "..."}]',
    en: 'Expected format: [{"title": "...", "date": "...", "description": "...", "link": "..."}]'
  },
  'projects_format': {
    fr: 'Format attendu : [{"title": "...", "date": "...", "description": "...", "link": "..."}]',
    en: 'Expected format: [{"title": "...", "date": "...", "description": "...", "link": "..."}]'
  },
  'technical_skills_format': {
    fr: 'Format attendu : [{"name": "...", "level": "..."}]',
    en: 'Expected format: [{"name": "...", "level": "..."}]'
  },
  'soft_skills_format': {
    fr: 'Format attendu : [{"name": "...", "level": "..."}]',
    en: 'Expected format: [{"name": "...", "level": "..."}]'
  },
  'languages_format': {
    fr: 'Format attendu : [{"name": "...", "level": "..."}]',
    en: 'Expected format: [{"name": "...", "level": "..."}]'
  },
  'degrees': {
    fr: 'Diplômes',
    en: 'Degrees'
  },
  'degrees_format': {
    fr: 'Format attendu : [{"title": "...", "institution": "...", "year": 2024}]',
    en: 'Expected format: [{"title": "...", "institution": "...", "year": 2024}]'
  },
  'experiences': {
    fr: 'Expériences',
    en: 'Experiences'
  },
  'experiences_format': {
    fr: 'Format attendu : [{"title": "...", "company": "...", "description": "...", "start_date": "...", "end_date": "..."}]',
    en: 'Expected format: [{"title": "...", "company": "...", "description": "...", "start_date": "...", "end_date": "..."}]'
  },

  // Abonnements
  'new_subscription': { fr: 'Nouvel abonnement', en: 'New subscription' },
  'create_subscription': { fr: 'Créer un abonnement', en: 'Create subscription' },
  'edit_subscription': { fr: "Modifier l'abonnement", en: 'Edit subscription' },
  'profile_id_label': { fr: 'ID du profil', en: 'Profile ID' },
  'profile_id_placeholder': { fr: 'Ex: 1', en: 'E.g.: 1' },
  'start_date_label': { fr: 'Date de début', en: 'Start date' },
  'end_date_label': { fr: 'Date de fin', en: 'End date' },
  'type_label': { fr: 'Type', en: 'Type' },
  'payment_method_label': { fr: 'Moyen de paiement', en: 'Payment method' },
  'premium': { fr: 'Premium', en: 'Premium' },
  'standard': { fr: 'Standard', en: 'Standard' },
  'basic': { fr: 'Basique', en: 'Basic' },
  'credit_card': { fr: 'Carte bancaire', en: 'Credit card' },
  'paypal': { fr: 'PayPal', en: 'PayPal' },
  'bank_transfer': { fr: 'Virement', en: 'Bank transfer' },
  'visa': { fr: 'Visa', en: 'Visa' },
  'mastercard': { fr: 'Mastercard', en: 'Mastercard' },
  'subscription_created': { fr: 'Abonnement créé avec succès !', en: 'Subscription created successfully!' },
  'subscription_updated': { fr: 'Abonnement modifié avec succès !', en: 'Subscription updated successfully!' },
  'creation_failed': { fr: 'Création échouée', en: 'Creation failed' },
  'update_error': { fr: 'Modification échouée', en: 'Update failed' },
  'network_error': { fr: 'Erreur réseau', en: 'Network error' },
  'error': { fr: 'Erreur', en: 'Error' },
  'creating': { fr: 'Création...', en: 'Creating...' },
  'updating': { fr: 'Modification...', en: 'Updating...' },
  
  // ✅ NOUVELLES CLÉS POUR LA GESTION DES ABONNEMENTS
  'subscription_management': {
    fr: "Gestion de l'abonnement",
    en: 'Subscription management'
  },
  'already_subscribed': {
    fr: 'Vous êtes déjà abonné.',
    en: 'You are already subscribed.'
  },
  'subscription_expires': {
    fr: 'Votre abonnement expire le',
    en: 'Your subscription expires on'
  },
  'renew': {
    fr: 'Renouveler',
    en: 'Renew'
  },
  'payment_history': {
    fr: 'Historique des paiements',
    en: 'Payment history'
  },
  'no_payment_recorded': {
    fr: 'Aucun paiement enregistré.',
    en: 'No payment recorded.'
  },
  
  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'mobile_money_payment': {
    fr: 'Paiement Mobile Money',
    en: 'Mobile Money payment'
  },
  'no_subscription': {
    fr: 'Aucun abonnement',
    en: 'No subscription'
  },
  'loading_subscription': {
    fr: 'Chargement de votre abonnement...',
    en: 'Loading your subscription...'
  },

  // User management
  'user_management': { fr: 'Gestion des utilisateurs', en: 'User Management' },
  'current_role': { fr: 'Rôle actuel', en: 'Current Role' },
  'new_role': { fr: 'Nouveau rôle', en: 'New Role' },
  'action': { fr: 'Action', en: 'Action' },
  'update_role': { fr: 'Mettre à jour', en: 'Update' },
  'role_updated': { fr: 'Rôle mis à jour avec succès', en: 'Role updated successfully' },
  'role_update_error': { fr: 'Erreur lors de la mise à jour du rôle', en: 'Error updating role' },
  'select_role': { fr: 'Sélectionner un rôle', en: 'Select a role' },
  'admin': { fr: 'Administrateur', en: 'Admin' },
  'user': { fr: 'Utilisateur', en: 'User' },
  'super_admin': { fr: 'Super Administrateur', en: 'Super Admin' },
  'update': { fr: 'Mettre à jour', en: 'Update' },
  'no_users': { fr: 'Aucun utilisateur trouvé', en: 'No users found' },
  'researcher': { fr: 'Chercheur', en: 'Researcher' },
  'role': { fr: 'Rôle', en: 'Role' },
  'role_warning': {
    fr: '⚠️ Attention ! Vous allez perdre vos droits administrateur.',
    en: '⚠️ Warning! You are about to lose your admin rights.'
  },
  'role_warning_continue': {
    fr: 'Après ce changement, vous ne pourrez plus accéder au dashboard admin.\n\nVoulez-vous vraiment continuer ?',
    en: 'After this change, you will no longer be able to access the admin dashboard.\n\nDo you really want to continue?'
  },

  // Valeurs backend
  'active_status': { fr: 'Actif', en: 'Active' },
  'inactive_status': { fr: 'Inactif', en: 'Inactive' },
  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'status': { fr: 'Statut', en: 'Status' },

  // ✅ NOUVELLES CLÉS POUR LE PROFIL
  'profile_updated_success': {
    fr: 'Profil mis à jour avec succès',
    en: 'Profile updated successfully'
  },
  'profile_update_error': {
    fr: 'Erreur lors de la mise à jour',
    en: 'Error while updating'
  },
  'no_profile_found': {
    fr: 'Aucun profil trouvé',
    en: 'No profile found'
  },
  'not_specified_feminine': {
    fr: 'Non spécifiée',
    en: 'Not specified'
  },

  // Resume/CV
  'my_skills': { fr: 'Mes compétences', en: 'My Skills' },
  'technical_skills': { fr: 'Compétences techniques', en: 'Technical Skills' },
  'soft_skills': { fr: 'Compétences relationnelles', en: 'Soft Skills' },
  'degrees_certifications': { fr: 'Diplômes / Certifications', en: 'Degrees / Certifications' },
  'experience': { fr: 'Expérience', en: 'Experience' },
  'languages_i_speak': { fr: 'Langues parlées', en: 'Languages I speak' },
  'social_media': { fr: 'Réseaux sociaux', en: 'Social Media' },

  // Languages
  'english': { fr: 'Anglais', en: 'English' },
  'french': { fr: 'Français', en: 'French' },
  'spanish': { fr: 'Espagnol', en: 'Spanish' },
  'italian': { fr: 'Italien', en: 'Italian' },

  // Language levels
  'proficient': { fr: 'Courant', en: 'Proficient' },
  'fluent': { fr: 'Courant', en: 'Fluent' },
  'intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
  'basic_level': { fr: 'Débutant', en: 'Basic' },
  'ui_design': { fr: 'Design UI', en: 'UI Design' },
  'certificate': { fr: 'Certificat', en: 'Certificate' },
  'sr_ux_designer': { fr: 'Designer UX Senior', en: 'Sr. UX Designer' },
  'bachelors': { fr: 'Licence', en: "Bachelor's" },
  'cloud_computing': { fr: 'Cloud Computing', en: 'Cloud Computing' },

  // Admin Dashboard
  'accounts': { fr: 'Comptes', en: 'Accounts' },
  'subscriptions': { fr: 'Abonnements', en: 'Subscriptions' },
  'total': { fr: 'Total', en: 'Total' },
  'active': { fr: 'Actif', en: 'Active' },
  'inactive': { fr: 'Inactif', en: 'Inactive' },
  'new': { fr: 'Nouveau', en: 'New' },
  'search': { fr: 'Rechercher', en: 'Search' },
  'all': { fr: 'Tous', en: 'All' },
  'reset': { fr: 'Réinitialiser', en: 'Reset' },
  'no_accounts': { fr: 'Aucun compte trouvé', en: 'No accounts found' },
  'no_subscriptions': { fr: 'Aucun abonnement', en: 'No subscriptions' },
  'profile_id': { fr: 'ID Profil', en: 'Profile ID' },
  'start_date': { fr: 'Date de début', en: 'Start date' },
  'end_date': { fr: 'Date de fin', en: 'End date' },
  'type': { fr: 'Type', en: 'Type' },
  'payment_method': { fr: 'Moyen de paiement', en: 'Payment Method' },
  'total_revenue': { fr: 'Revenu total', en: 'Total Revenue' },
  'monthly_revenue': { fr: 'Revenus mensuels', en: 'Monthly revenue' },
  'renewal_rate': { fr: 'Taux de renouvellement', en: 'Renewal Rate' },
  'dashboard_title': { fr: 'Tableau de bord administrateur', en: 'Admin Dashboard' },
  'total_subscriptions': { fr: 'Total des abonnements', en: 'Total Subscriptions' },
  'id': { fr: 'ID', en: 'ID' },
  'revenue_chart': { fr: 'Évolution des revenus', en: 'Revenue Evolution' },
  'month': { fr: 'Mois', en: 'Month' },
  'subscription_by_type': { fr: 'Répartition par type', en: 'Subscription by type' },
  'new_subscriptions': { fr: 'Nouveaux abonnements', en: 'New subscriptions' },
  'new_subscriptions_chart': { fr: 'Nouveaux abonnements par mois', en: 'New subscriptions per month' },
  'count': { fr: 'Nombre', en: 'Count' },

  // Researcher Dashboard
  'dashboard': { fr: 'Tableau de bord', en: 'Dashboard' },
  'profile': { fr: 'Profil', en: 'Profile' },
  'personal_info': { fr: 'Informations personnelles', en: 'Personal Info' },
  'contact': { fr: 'Contact', en: 'Contact' },
  'security': { fr: 'Sécurité', en: 'Security' },
  'password': { fr: 'Mot de passe', en: 'Password' },
  'title': { fr: 'Titre', en: 'Title' },
  'date': { fr: 'Date', en: 'Date' },
  'description': { fr: 'Description', en: 'Description' },
  'link': { fr: 'Lien', en: 'Link' },
  'authors': { fr: 'Auteurs', en: 'Authors' },
  'add_author': { fr: 'Ajouter un auteur et appuyer sur Entrée', en: 'Add author & press Enter' },
  'messages': { fr: 'Messages', en: 'Messages' },
  'title_required': {
    fr: 'Le titre est requis',
    en: 'Title is required'
  },
  'date_required': {
    fr: 'La date est requise',
    en: 'Date is required'
  },
  'description_required': {
    fr: 'La description est requise',
    en: 'Description is required'
  },
  'link_required': {
    fr: 'Le lien est requis',
    en: 'Link is required'
  },
  'loading_projects': {
    fr: 'Chargement des projets...',
    en: 'Loading projects...'
  },
  'please_login_again': {
    fr: 'Veuillez vous reconnecter',
    en: 'Please log in again'
  },
  'project_created_success': {
    fr: 'Projet créé avec succès !',
    en: 'Project created successfully!'
  },
  'project_updated_success': {
    fr: 'Projet modifié avec succès !',
    en: 'Project updated successfully!'
  },
  'project_deleted_success': {
    fr: 'Projet supprimé avec succès !',
    en: 'Project deleted successfully!'
  },
  'project_create_error': {
    fr: 'Erreur lors de la création du projet',
    en: 'Error creating project'
  },
  'project_update_error': {
    fr: 'Erreur lors de la modification du projet',
    en: 'Error updating project'
  },
  'project_delete_error': {
    fr: 'Erreur lors de la suppression du projet',
    en: 'Error deleting project'
  },
  'project_delete_confirm': {
    fr: 'Êtes-vous sûr de vouloir supprimer ce projet ?',
    en: 'Are you sure you want to delete this project?'
  },

  // Paiement
  'payment': { fr: 'Paiement', en: 'Payment' },
  'payment_title': { fr: 'Paiement Mobile Money', en: 'Mobile Money Payment' },
  'phone_placeholder': { fr: 'Numéro (ex: 612345678)', en: 'Phone number (e.g., 612345678)' },
  'amount_placeholder': { fr: 'Montant (XAF)', en: 'Amount (XAF)' },
  'processing': { fr: 'Paiement en cours...', en: 'Processing payment...' },
  'pay': { fr: 'Payer', en: 'Pay' },

  // ✅ Nouvelle clé ajoutée juste après payment
  'payments': {
    fr: 'Paiements',
    en: 'Payments',
  },

  // ✅ NOUVELLES CLÉS POUR LES PAIEMENTS
  'payment_started_success': {
    fr: 'Paiement initié avec succès',
    en: 'Payment initiated successfully'
  },
  'payment_error': {
    fr: 'Erreur paiement',
    en: 'Payment error'
  },
  // ✅ NOUVELLES CLÉS POUR LE TÉLÉCHARGEMENT DES REÇUS
  'receipt_download_error': {
    fr: 'Impossible de télécharger le reçu.',
    en: 'Unable to download the receipt.'
  },
  'downloading': {
    fr: 'Téléchargement...',
    en: 'Downloading...'
  },
  // 'network_error' existe déjà à la ligne 191

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'payment_in_progress': {
    fr: 'Paiement en cours...',
    en: 'Payment in progress...'
  },

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'premium_inactive': {
    fr: 'ABONNEMENT STANDARD',
    en: 'STANDARD SUBSCRIPTION'
  },

  // ✅ NOUVELLES CLÉS POUR LE TÉLÉCHARGEMENT DE CV
  'cv_select_file': {
    fr: 'Veuillez sélectionner un fichier',
    en: 'Please select a file'
  },
  'no_cv_to_delete': {
    fr: 'Aucun CV à supprimer',
    en: 'No CV to delete'
  },

  // ✅ NOUVELLES CLÉS POUR LE TÉLÉCHARGEMENT DE CV
  'cv_pdf_only': {
    fr: 'Seuls les fichiers PDF sont acceptés',
    en: 'Only PDF files are accepted'
  },
  'cv_size_error': {
    fr: 'Le fichier ne doit pas dépasser 5 MB',
    en: 'The file must not exceed 5 MB'
  },

  // ✅ NOUVELLES CLÉS POUR L'UPLOAD D'IMAGE
  'image_file_required': {
    fr: 'Veuillez sélectionner un fichier image',
    en: 'Please upload an image file'
  },
  'image_upload_error': {
    fr: "Erreur lors de l'upload de l'image.",
    en: 'Error uploading image.'
  },

  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'update_failed': {
    fr: 'Modification échouée',
    en: 'Update failed'
  },
  'publication_preview': {
    fr: 'Aperçu de la publication',
    en: 'Publication preview'
  },

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'password_change_error': {
    fr: 'Erreur lors du changement de mot de passe',
    en: 'Error changing password'
  },

  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'conference': {
    fr: 'Conférence',
    en: 'Conference'
  },
  'doi': {
    fr: 'DOI',
    en: 'DOI'
  },
  'project_preview': {
    fr: 'Aperçu du projet',
    en: 'Project preview'
  },

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'premium_description': {
    fr: 'Débloquez toutes les fonctionnalités du portfolio chercheur.',
    en: 'Unlock all features of the researcher portfolio.'
  },

  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'gender_male': {
    fr: 'Homme',
    en: 'Male'
  },
  'gender_female': {
    fr: 'Femme',
    en: 'Female'
  },

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'published': {
    fr: 'Publié',
    en: 'Published'
  },

  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'publication_fetch_error': {
    fr: 'Impossible de récupérer la publication.',
    en: 'Unable to retrieve the publication.'
  },
  'publication_delete_confirm': {
    fr: 'Voulez-vous vraiment supprimer cette publication ?',
    en: 'Are you sure you want to delete this publication?'
  },
  'publication_delete_error': {
    fr: 'La suppression a échoué.',
    en: 'Deletion failed.'
  },
  'publication_update_error': {
    fr: 'La modification a échoué.',
    en: 'Update failed.'
  },
  'publication_updated': {
    fr: 'Publication modifiée avec succès.',
    en: 'Publication updated successfully.'
  },
  'close': {
    fr: 'Fermer',
    en: 'Close'
  },

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'new_publication': {
    fr: 'Nouvelle publication',
    en: 'New publication'
  },

  // ✅ NOUVELLES CLÉS AJOUTÉES ICI
  'journal_conference': {
    fr: 'Journal / Conférence',
    en: 'Journal / Conference'
  },
  'open_publication': {
    fr: 'Ouvrir la publication',
    en: 'Open publication'
  },

  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'researcher_info_error': {
    fr: 'Impossible de récupérer les informations du chercheur.',
    en: 'Unable to retrieve researcher information.'
  },

  // Audit & statistiques
  'audit': {
    fr: 'Journal d’audit',
    en: 'Audit logs'
  },

  // Page publique chercheur
  'researcher_not_found': { fr: 'Chercheur non trouvé', en: 'Researcher not found' },
  'not_specified': { fr: 'Non spécifié', en: 'Not specified' },
  'bio_title': { fr: 'Bio', en: 'Bio' },
  'no_bio': { fr: 'Aucune bio pour le moment.', en: 'No bio at the moment.' },
  'cv_title': { fr: 'CV', en: 'Resume' },
  'download_cv': { fr: 'Télécharger le CV', en: 'Download CV' },
  'no_cv': { fr: 'Aucun CV disponible pour le moment.', en: 'No CV available at the moment.' },
  'cv_preview_title': {
    fr: 'Aperçu du CV',
    en: 'CV Preview'
  },
  'cv_preview_description': {
    fr: 'Visualisation du document PDF',
    en: 'PDF document preview'
  },
  'cv_loading': {
    fr: 'Chargement du CV...',
    en: 'Loading CV...'
  },
  'cv_display_error': {
    fr: "Impossible d'afficher le CV.",
    en: 'Unable to display the CV.'
  },
  'no_cv_to_display': {
    fr: 'Aucun CV à afficher.',
    en: 'No CV to display.'
  },
  'publications_title': { fr: 'Publications', en: 'Publications' },
  'no_publications': { fr: 'Aucune publication.', en: 'No publications.' },
  'projects_title': { fr: 'Projets', en: 'Projects' },
  'no_projects': { fr: 'Aucun projet.', en: 'No projects.' },
  'contact_title': { fr: 'Contacter', en: 'Contact' },
  'your_name': { fr: 'Votre nom', en: 'Your name' },
  'your_email': { fr: 'Votre email', en: 'Your email' },
  'your_message': { fr: 'Votre message', en: 'Your message' },
  'sending': { fr: 'Envoi...', en: 'Sending...' },
  'send': { fr: 'Envoyer', en: 'Send' },

  // Page accueil InchTechs
  'home_title': { fr: 'Bienvenue sur InchTechs', en: 'Welcome to InchTechs' },
  'home_subtitle': { fr: 'Plateforme de portfolios pour chercheurs', en: 'Portfolio platform for researchers' },

  // Subscriptions
  'username': { fr: "Nom d'utilisateur", en: 'Username' },
  'email': { fr: 'Email', en: 'Email' },
  'total_amount': { fr: 'Montant total', en: 'Total Amount' },
  'started_at': { fr: 'Commencé le', en: 'Started At' },
  'next_billing_date': { fr: 'Prochaine facturation', en: 'Next Billing Date' },

  // Notifications
  'notifications': { fr: 'Notifications', en: 'Notifications' },
  'subscription_expiring': { fr: 'Abonnement expire bientôt', en: 'Subscription expiring soon' },

  // Personal Info
  'name': { fr: 'Nom', en: 'Name' },
  'profession': { fr: 'Profession', en: 'Profession' },
  'about_you': { fr: 'À propos de vous', en: 'About you' },
  'no_name': { fr: 'Aucun nom défini', en: 'No name has been set' },
  'no_profession': { fr: 'Aucune profession définie', en: 'No profession has been set' },
  'no_about': { fr: 'Aucune description définie', en: 'No about has been set' },

  // Modal errors
  'name_required': { fr: 'Le nom est requis', en: 'Name is required' },
  'profession_required': { fr: 'La profession est requise', en: 'Profession is required' },
  'about_required': { fr: 'La description est requise', en: 'About section is required' },
  'email_required': { fr: "L'email est requis", en: 'Email is required' },
  'linkedin': { fr: 'LinkedIn', en: 'LinkedIn' },
  'whatsapp': { fr: 'WhatsApp', en: 'WhatsApp' },
  'twitter': { fr: 'X (Twitter)', en: 'X (Twitter)' },
  'github': { fr: 'GitHub', en: 'GitHub' },

  // Inscription
  'first_name': {
    fr: 'Prénom',
    en: 'First name'
  },
  'last_name': {
    fr: 'Nom',
    en: 'Last name'
  },
  'already_have_account': {
    fr: 'Déjà un compte ?',
    en: 'Already have an account?'
  },
  'registration_success': {
    fr: '✅ Inscription réussie ! Un email d\'activation vous a été envoyé. Vérifiez votre boîte mail (et vos spams).',
    en: '✅ Registration successful! An activation email has been sent to you. Check your inbox (and spam).'
  },
  'registration_success_activate': {
    fr: '✅ Inscription réussie ! Veuillez activer votre compte via le lien reçu par email.',
    en: '✅ Registration successful! Please activate your account via the link received by email.'
  },
  'registering': {
    fr: 'Inscription...',
    en: 'Registering...'
  },
  'passwords_not_match': {
    fr: 'Les mots de passe ne correspondent pas',
    en: 'Passwords do not match'
  },
  'registration_error': {
    fr: 'Erreur lors de l\'inscription',
    en: 'Registration error'
  },

  // Activation de compte
  'activation_in_progress': {
    fr: 'Activation en cours...',
    en: 'Activating...'
  },
  'please_wait': {
    fr: 'Veuillez patienter...',
    en: 'Please wait...'
  },
  'activation_token_missing': {
    fr: "Token d'activation manquant",
    en: 'Missing activation token'
  },
  'account_activated': {
    fr: 'Compte activé !',
    en: 'Account Activated!'
  },
  'account_activated_successfully': {
    fr: 'Votre compte a été activé avec succès !',
    en: 'Your account has been activated successfully!'
  },
  'redirecting_to_login': {
    fr: 'Redirection vers la connexion...',
    en: 'Redirecting to login...'
  },
  'login_now': {
    fr: 'Se connecter maintenant',
    en: 'Login now'
  },
  'activation_error': {
    fr: "Erreur d'activation",
    en: 'Activation Error'
  },
  'account_activation_error': {
    fr: "Erreur lors de l'activation du compte",
    en: 'Error activating account'
  },
  'create_account': {
    fr: 'Créer un compte',
    en: 'Create an account'
  },

  // Page chercheur détail
  'view_profile': {
    fr: 'Voir le profil',
    en: 'View Profile'
  },
  'profile_completion': {
    fr: 'Complétude du profil',
    en: 'Profile Completion'
  },
  'cv_description': {
    fr: 'Consultez ou téléchargez le CV du chercheur.',
    en: "View or download the researcher's CV."
  },
  'view_cv': {
    fr: 'Voir le CV',
    en: 'View CV'
  },
  'download': {
    fr: 'Télécharger',
    en: 'Download'
  },
  'back': {
    fr: 'Retour',
    en: 'Back'
  },
  'gender': {
    fr: 'Genre',
    en: 'Gender'
  },
  'grade': {
    fr: 'Grade',
    en: 'Grade'
  },
  'domain': {
    fr: 'Domaine',
    en: 'Domain'
  },
  'journal': {
    fr: 'Journal',
    en: 'Journal'
  },
  'no_description': {
    fr: 'Aucune description disponible',
    en: 'No description available'
  },
  'cv_exists': {
    fr: 'CV actuellement enregistré',
    en: 'Current CV'
  },

  // Login
  'logging_in': {
    fr: 'Connexion...',
    en: 'Logging in...'
  },
  'dont_have_account': {
    fr: 'Pas encore de compte ?',
    en: "Don't have an account?"
  },
  'sign_up': {
    fr: "S'inscrire",
    en: 'Register'
  },

  // Researchers
  'researchers': {
    fr: 'Chercheurs', // ✅ Mise à jour vers "Chercheurs" pour le dashboard admin
    en: 'Researchers'
  },
  'no_researchers_found': {
    fr: 'Aucun chercheur trouvé.',
    en: 'No researchers found.'
  },

  // Public Researcher Page
  'languages_title': {
    fr: 'Langues',
    en: 'Languages'
  },
  'degrees_title': {
    fr: 'Diplômes / Certifications',
    en: 'Degrees / Certifications'
  },
  'experiences_title': {
    fr: 'Expériences',
    en: 'Experience'
  },
  'view_publication': {
    fr: 'Voir la publication',
    en: 'View publication'
  },
  'view_project': {
    fr: 'Voir le projet',
    en: 'View project'
  },
  'email_label': {
    fr: 'Email',
    en: 'Email'
  },
  'whatsapp_label': {
    fr: 'WhatsApp',
    en: 'WhatsApp'
  },
  'linkedin_label': {
    fr: 'LinkedIn',
    en: 'LinkedIn'
  },
  'github_label': {
    fr: 'GitHub',
    en: 'GitHub'
  },

  // Security
  'password_required': { fr: 'Le mot de passe est requis', en: 'Password is required' },
  'password_min_length': { fr: 'Le mot de passe doit contenir au moins 8 caractères', en: 'Password must be at least 8 characters' },
  'confirm_password_required': { fr: 'Veuillez confirmer votre mot de passe', en: 'Please confirm your password' },
  'password_mismatch': { fr: 'Les mots de passe ne correspondent pas', en: 'Passwords do not match' },
  'new_password': { fr: 'Nouveau mot de passe', en: 'New password' },
  'confirm_password': { fr: 'Confirmer le mot de passe', en: 'Confirm password' },
  'password_updated': { fr: 'Mot de passe mis à jour avec succès', en: 'Password updated successfully' },

  // CV Modal
  'add': { fr: 'Ajouter', en: 'Add' },
  'skill': { fr: 'Compétence', en: 'Skill' },
  'language': { fr: 'Langue', en: 'Language' },
  'degree': { fr: 'Diplôme', en: 'Degree' },
  'technical': { fr: 'Technique', en: 'Technical' },
  'soft': { fr: 'Relationnelle', en: 'Soft' },
  'skill_name': { fr: 'Nom de la compétence', en: 'Skill name' },
  'level': { fr: 'Niveau', en: 'Level' },
  'language_name': { fr: 'Nom de la langue', en: 'Language name' },
  'language_level': {
    fr: 'Niveau (Débutant, Intermédiaire, Courant, Natif)',
    en: 'Level (Beginner, Intermediate, Fluent, Native)'
  },
  'degree_title': { fr: 'Titre du diplôme', en: 'Degree title' },
  'institution': { fr: 'Établissement', en: 'Institution' },
  'year': { fr: 'Année', en: 'Year' },
  'exp_title': { fr: 'Titre du poste', en: 'Job title' },
  'company': { fr: 'Entreprise', en: 'Company' },

  // Langues et niveaux
  'level_beginner': { fr: 'Débutant', en: 'Beginner' },
  'level_intermediate': { fr: 'Intermédiaire', en: 'Intermediate' },
  'level_fluent': { fr: 'Courant', en: 'Fluent' },
  'level_native': { fr: 'Natif', en: 'Native' },
  'type_to_search': { fr: 'Tapez pour rechercher une langue', en: 'Type to search for a language' },
  'select_level': { fr: 'Sélectionnez un niveau', en: 'Select a level' },
  'add_language': { fr: 'Ajouter une langue', en: 'Add Language' },
  'no_languages': { fr: 'Aucune langue ajoutée', en: 'No languages added' },

  // Upload CV
  'upload_cv': { fr: 'Télécharger mon CV', en: 'Upload my CV' },
  'choose_file': { fr: 'Choisir un fichier', en: 'Choose file' },
  'no_file_chosen': { fr: 'Aucun fichier choisi', en: 'No file chosen' },
  'file_chosen': { fr: 'Fichier choisi', en: 'File chosen' },
  'upload': { fr: 'Télécharger', en: 'Upload' },
  'delete_cv': { fr: 'Supprimer le CV', en: 'Delete CV' },
  'delete_cv_confirm': {
    fr: 'Êtes-vous sûr de vouloir supprimer votre CV ?',
    en: 'Are you sure you want to delete your CV?'
  },
  'cv_delete_success': {
    fr: 'CV supprimé avec succès',
    en: 'CV deleted successfully'
  },
  'cv_upload_success': {
    fr: 'CV téléchargé avec succès',
    en: 'CV uploaded successfully'
  },
  'cv_upload_error': {
    fr: 'Erreur lors du téléchargement du CV',
    en: 'Error uploading CV'
  },

  // Messages
  'no_messages': { fr: 'Aucun message reçu.', en: 'No messages received.' },
  'mark_as_read': { fr: 'Marquer comme lu', en: 'Mark as read' },

  // User Actions
  'activate': { fr: 'Activer', en: 'Activate' },
  'deactivate': { fr: 'Désactiver', en: 'Deactivate' },
  'detail': { fr: 'Détail', en: 'Details' },
  'user_activated_success': {
    fr: 'Utilisateur activé avec succès',
    en: 'User activated successfully'
  },
  'user_deactivated_success': {
    fr: 'Utilisateur désactivé avec succès',
    en: 'User deactivated successfully'
  },
  'activate_user_error': {
    fr: "Impossible d'activer l'utilisateur",
    en: 'Unable to activate user'
  },
  'deactivate_user_error': {
    fr: "Impossible de désactiver l'utilisateur",
    en: 'Unable to deactivate user'
  },

  // ==================== NOUVELLES CLÉS POUR STATISTIQUES ====================
  'statistics': {
    fr: 'Statistiques',
    en: 'Statistics',
  },
  'stats_title': {
    fr: "Mes statistiques",
    en: "My Statistics",
  },
  'likes': {
    fr: "J'aime",
    en: "Likes",
  },
  'favorites': {
    fr: "Favoris",
    en: "Favorites",
  },
  // 'comments' est déjà défini plus haut
  'publication_views': {
    fr: "Vues",
    en: "Views",
  },
  'premium_active': {
    fr: "Premium actif",
    en: "Premium Active",
  },
  'premium_plan': {
    fr: "Plan",
    en: "Plan",
  },
  'expires_on': {
    fr: "Expire le",
    en: "Expires on",
  },
  'days_remaining': {
    fr: "Jours restants",
    en: "Days remaining",
  },
  // ✅ NOUVELLE CLÉ AJOUTÉE ICI
  'loading_statistics': {
    fr: 'Chargement de vos statistiques...',
    en: 'Loading your statistics...'
  },
  // ✅ Nouvelles clés Admin Statistics fusionnées ici
  'views': {
    fr: 'Vues',
    en: 'Views',
  },
  'revenue': {
    fr: 'Revenus (FCFA)',
    en: 'Revenue (FCFA)',
  },
  'platform_statistics': {
    fr: 'Statistiques de la plateforme',
    en: 'Platform Statistics',
  },
  // ✅ Ajout de la clé roles_distribution
  'roles_distribution': {
    fr: 'Répartition des rôles',
    en: 'Roles Distribution',
  },

  // ==================== NOUVELLES CLÉS POUR PROJECT DETAIL ====================
  'project_details': {
    fr: 'Détails du projet',
    en: 'Project details'
  },
  'budget': {
    fr: 'Budget',
    en: 'Budget'
  },
  
  // ✅ NOUVELLES CLÉS POUR PREMIUM (AJOUTÉES ICI)
  'unlimited_publications': {
    fr: 'Publications illimitées',
    en: 'Unlimited publications'
  },
  'featured_profile': {
    fr: 'Profil mis en avant',
    en: 'Featured profile'
  },
  'priority_search': {
    fr: 'Apparition prioritaire dans les recherches',
    en: 'Priority appearance in searches'
  },
  'full_statistics_access': {
    fr: 'Accès complet aux statistiques',
    en: 'Full access to statistics'
  },
  'priority_support': {
    fr: 'Support prioritaire',
    en: 'Priority support'
  },
  'subscribe_now': {
    fr: 'Souscrivez maintenant',
    en: 'Subscribe now'
  },
  
  // ✅ AJOUT DES DEUX NOUVELLES CLÉS ICI
  'download_error': {
    fr: 'Erreur lors du téléchargement',
    en: 'Download error'
  },
  'save_error': {
    fr: 'Erreur lors de la sauvegarde',
    en: 'Error while saving'
  },
  
  'collaborators': {
    fr: 'Collaborateurs',
    en: 'Collaborators'
  },

  'male': {
    fr: 'Homme',
    en: 'Male'
  },

  'female': {
    fr: 'Femme',
    en: 'Female'
  },

  'languages': {
    fr: 'Langues',
    en: 'Languages'
  },

  'administrator': {
    fr: 'Administrateur',
    en: 'Administrator'
  },

  'all_fields_required': {
    fr: 'Tous les champs sont obligatoires',
    en: 'All fields are required'
  },

  'audit_logs_load_error': {
    fr: 'Erreur lors du chargement des journaux',
    en: 'Error loading audit logs'
  },

  'author_required': {
    fr: 'L’auteur est obligatoire',
    en: 'Author is required'
  },

  'create_researcher': {
    fr: 'Créer un chercheur',
    en: 'Create researcher'
  },

  'deleting': {
    fr: 'Suppression...',
    en: 'Deleting...'
  },

  'description_placeholder': {
    fr: 'Entrez une description',
    en: 'Enter a description'
  },

  'diplome': {
    fr: 'Diplôme',
    en: 'Degree'
  },

  'first_name_required': {
    fr: 'Le prénom est obligatoire',
    en: 'First name is required'
  },

  'grade_required': {
    fr: 'Le grade est obligatoire',
    en: 'Grade is required'
  },

  'invalid_image_file': {
    fr: 'Fichier image invalide',
    en: 'Invalid image file'
  },

  'last_name_required': {
    fr: 'Le nom est obligatoire',
    en: 'Last name is required'
  },

  'loading_publications': {
    fr: 'Chargement des publications...',
    en: 'Loading publications...'
  },

  'publication_create_error': {
    fr: 'Erreur lors de la création de la publication',
    en: 'Error creating publication'
  },

  'publication_created_success': {
    fr: 'Publication créée avec succès',
    en: 'Publication created successfully'
  },

  'publication_deleted_success': {
    fr: 'Publication supprimée avec succès',
    en: 'Publication deleted successfully'
  },

  'publication_updated_success': {
    fr: 'Publication modifiée avec succès',
    en: 'Publication updated successfully'
  },

  'researcher_created_success': {
    fr: 'Chercheur créé avec succès',
    en: 'Researcher created successfully'
  },

  'researcher_creation_error': {
    fr: 'Erreur lors de la création du chercheur',
    en: 'Error creating researcher'
  },

  'select_option': {
    fr: 'Sélectionner une option',
    en: 'Select an option'
  },

  'specialite': {
    fr: 'Spécialité',
    en: 'Specialty'
  },

  'upgrade_to_premium': {
    fr: 'Passer à Premium',
    en: 'Upgrade to Premium'
  },

  'uploading': {
    fr: 'Téléchargement...',
    en: 'Uploading...'
  },

  // ==================== NOUVELLES CLÉS POUR LES COURS ====================
  'courses': {
    fr: 'Cours',
    en: 'Courses'
  },

  'curricula': {
    fr: 'Programme du cours',
    en: 'Course curriculum'
  },

  'curricula_help': {
    fr: 'Décrivez le programme, les chapitres ou les principaux contenus du cours.',
    en: 'Describe the course program, chapters, or main course contents.'
  },

  'loading_courses': {
    fr: 'Chargement des cours...',
    en: 'Loading courses...'
  },

  'no_courses': {
    fr: 'Aucun cours ajouté.',
    en: 'No courses added.'
  },

  'saving': {
    fr: 'Enregistrement...',
    en: 'Saving...'
  },

  'course_created_success': {
    fr: 'Cours créé avec succès.',
    en: 'Course created successfully.'
  },

  'course_create_error': {
    fr: 'Erreur lors de la création du cours.',
    en: 'Error while creating the course.'
  },

  'course_updated_success': {
    fr: 'Cours modifié avec succès.',
    en: 'Course updated successfully.'
  },

  'course_update_error': {
    fr: 'Erreur lors de la modification du cours.',
    en: 'Error while updating the course.'
  },

  'course_delete_confirm': {
    fr: 'Voulez-vous vraiment supprimer ce cours ?',
    en: 'Do you really want to delete this course?'
  },

  'course_deleted_success': {
    fr: 'Cours supprimé avec succès.',
    en: 'Course deleted successfully.'
  },

  'course_delete_error': {
    fr: 'Erreur lors de la suppression du cours.',
    en: 'Error while deleting the course.'
  },
};

export function t(key: string, lang: string): string {
  const langKey = lang.toLowerCase() as 'fr' | 'en';
  const translation = translations[key];

  if (translation) {
    return translation[langKey] ?? key;
  }

  return key;
}