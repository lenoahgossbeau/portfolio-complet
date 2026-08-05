"""add description to publication

Revision ID: 09a321580ea6
Revises: f3b140a88240
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "09a321580ea6"
down_revision: Union[str, Sequence[str], None] = "f3b140a88240"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "publications",
        sa.Column("description", sa.Text(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("publications", "description")