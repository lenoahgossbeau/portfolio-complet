from sqlalchemy.orm import Session
from datetime import datetime

from models.profile import Profile
from models.cv import (
    TechnicalSkill,
    SoftSkill,
    Degree,
    Experience,
    Language,
)
from models.project import Project
from models.publication import Publication


class ResearcherImporter:
    """
    Service central d'import d'un chercheur.
    Toutes les importations (JSON, IA, etc.)
    passeront par cette classe.
    """

    def __init__(self, db: Session):
        self.db = db

    # -------------------------------------------------
    # PROFIL
    # -------------------------------------------------
    def get_or_create_profile(self, user):
        profile = user.profile

        if profile is None:
            profile = Profile(user_id=user.id)
            self.db.add(profile)
            self.db.flush()

        return profile

    # -------------------------------------------------
    # NETTOYAGE
    # -------------------------------------------------
    def clear_profile_data(self, profile_id: int):

        self.db.query(TechnicalSkill).filter_by(profile_id=profile_id).delete()

        self.db.query(SoftSkill).filter_by(profile_id=profile_id).delete()

        self.db.query(Language).filter_by(profile_id=profile_id).delete()

        self.db.query(Degree).filter_by(profile_id=profile_id).delete()

        self.db.query(Experience).filter_by(profile_id=profile_id).delete()

        self.db.query(Project).filter_by(profile_id=profile_id).delete()

        self.db.query(Publication).filter_by(profile_id=profile_id).delete()

    # -------------------------------------------------
    # SUPPRESSION PAR TYPE
    # -------------------------------------------------
    def clear_publications(self, profile_id: int):
        self.db.query(Publication).filter_by(profile_id=profile_id).delete()

    def clear_projects(self, profile_id: int):
        self.db.query(Project).filter_by(profile_id=profile_id).delete()

    def clear_technical_skills(self, profile_id: int):
        self.db.query(TechnicalSkill).filter_by(profile_id=profile_id).delete()

    def clear_soft_skills(self, profile_id: int):
        self.db.query(SoftSkill).filter_by(profile_id=profile_id).delete()

    def clear_languages(self, profile_id: int):
        self.db.query(Language).filter_by(profile_id=profile_id).delete()

    def clear_degrees(self, profile_id: int):
        self.db.query(Degree).filter_by(profile_id=profile_id).delete()

    def clear_experiences(self, profile_id: int):
        self.db.query(Experience).filter_by(profile_id=profile_id).delete()

    # -------------------------------------------------
    # MISE A JOUR DU PROFIL
    # -------------------------------------------------
    def update_profile(
        self,
        profile,
        data: dict,
        cv_url: str = None,
        profile_picture: str = None,
    ):
        profile.first_name = data.get("first_name", profile.first_name)
        profile.last_name = data.get("last_name", profile.last_name)
        profile.gender = data.get("gender", profile.gender)

        profile.grade = data.get("grade", profile.grade)
        profile.specialite = data.get("specialite", profile.specialite)
        profile.diplome = data.get("diplome", profile.diplome)

        profile.description = data.get("description", profile.description)
        profile.bio = data.get("bio", profile.bio)

        profile.email = data.get("email", profile.email)
        profile.linkedin = data.get("linkedin", profile.linkedin)
        profile.whatsapp = data.get("whatsapp", profile.whatsapp)
        profile.twitter = data.get("twitter", profile.twitter)
        profile.github = data.get("github", profile.github)

        if cv_url:
            profile.cv_url = cv_url

        if profile_picture:
            profile.profile_picture = profile_picture

        return profile

    # -------------------------------------------------
    # TECHNICAL SKILLS
    # -------------------------------------------------
    def import_technical_skills(self, profile_id: int, skills: list):

        for item in skills:

            skill = TechnicalSkill(
                profile_id=profile_id,
                skill_name=item.get("name", ""),
                level=int(item.get("level", 50))
            )

            self.db.add(skill)

    # -------------------------------------------------
    # SOFT SKILLS
    # -------------------------------------------------
    def import_soft_skills(self, profile_id: int, skills: list):

        for item in skills:

            skill = SoftSkill(
                profile_id=profile_id,
                skill_name=item.get("name", "")
            )

            self.db.add(skill)

    # -------------------------------------------------
    # LANGUES
    # -------------------------------------------------
    def import_languages(self, profile_id: int, languages: list):

        for item in languages:

            language = Language(
                profile_id=profile_id,
                language=item.get("name", ""),
                level=item.get("level", "Débutant")
            )

            self.db.add(language)

    # -------------------------------------------------
    # DIPLOMES
    # -------------------------------------------------
    def import_degrees(self, profile_id: int, degrees: list):

        for item in degrees:

            degree = Degree(
                profile_id=profile_id,
                title=item.get("title", ""),
                institution=item.get("institution", ""),
                year=int(item.get("year", 0)),
                description=item.get("description", "")
            )

            self.db.add(degree)

    # -------------------------------------------------
    # EXPERIENCES
    # -------------------------------------------------
    def import_experiences(self, profile_id: int, experiences: list):

        for item in experiences:

            start_date = None
            end_date = None

            if item.get("start_date"):
                start_date = datetime.strptime(
                    item["start_date"],
                    "%Y-%m-%d"
                ).date()

            if item.get("end_date"):
                end_date = datetime.strptime(
                    item["end_date"],
                    "%Y-%m-%d"
                ).date()

            experience = Experience(
                profile_id=profile_id,
                title=item.get("title", ""),
                company=item.get("company", ""),
                start_date=start_date,
                end_date=end_date,
                description=item.get("description", "")
            )

            self.db.add(experience)

    # -------------------------------------------------
    # PUBLICATIONS
    # -------------------------------------------------
    def import_publications(self, profile_id: int, publications: list):

        for item in publications:

            year = datetime.now().year

            if item.get("year"):
                year = int(item["year"])
            elif item.get("date"):
                year = int(str(item["date"])[:4])

            publication = Publication(
                profile_id=profile_id,
                year=year,
                title=item.get("title", ""),
                journal=item.get("journal", ""),
                doi=item.get("doi", ""),
                coauthor=item.get("coauthor") or item.get("coauthors", [])
            )

            self.db.add(publication)

    # -------------------------------------------------
    # PROJECTS
    # -------------------------------------------------
    def import_projects(self, profile_id: int, projects: list):

        for item in projects:

            year = datetime.now().year

            if item.get("year"):
                year = int(item["year"])
            elif item.get("date"):
                year = int(str(item["date"])[:4])

            # Gestion du budget
            budget = item.get("budget")
            if budget in ("", None):
                budget = None

            project = Project(
                profile_id=profile_id,
                year=year,
                title=item.get("title", ""),
                description=item.get("description", ""),
                budget=budget,
                coauthor=item.get("coauthor") or item.get("coauthors", [])
            )

            self.db.add(project)

    # -------------------------------------------------
    # IMPORT JSON COMPLET
    # -------------------------------------------------
    def import_json(
        self,
        profile,
        profile_data: dict,
        technical_skills: list,
        soft_skills: list,
        languages: list,
        degrees: list,
        experiences: list,
        publications: list,
        projects: list,
        cv_url: str = None,
        profile_picture: str = None,
    ):

        self.update_profile(
            profile,
            profile_data,
            cv_url=cv_url,
            profile_picture=profile_picture,
        )

        self.clear_profile_data(profile.id)

        self.import_technical_skills(profile.id, technical_skills)
        self.import_soft_skills(profile.id, soft_skills)
        self.import_languages(profile.id, languages)
        self.import_degrees(profile.id, degrees)
        self.import_experiences(profile.id, experiences)
        self.import_publications(profile.id, publications)
        self.import_projects(profile.id, projects)

    # -------------------------------------------------
    # SAUVEGARDE
    # -------------------------------------------------
    def save(self):
        self.db.commit()