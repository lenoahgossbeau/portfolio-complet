"""
Package models - Force l'import de tous les modèles
"""
# Import forcé de tous les modèles pour éviter les erreurs SQLAlchemy
from .user import User
from .profile import Profile
from .publication import Publication
from .project import Project
from .academic_career import AcademicCareer
from .distinction import Distinction
from .cours import Cours
from .media_artefact import MediaArtefact
from .like import Like
from .favorite import Favorite
from .comment import Comment
from .message_contact import MessageContact
from .audit import Audit
from .subscription import Subscription
from .refresh_token import RefreshToken
from .payment import Payment

__all__ = [
    'User',
    'Profile', 
    'Publication',
    'Project',
    'AcademicCareer',
    'Distinction',
    'Cours',
    'MediaArtefact',
    'Like',
    'Favorite',
    'Comment',
    'MessageContact',
    'Audit',
    'Subscription',
    'RefreshToken',
    'Payment'
]