from sqlalchemy import text
from database import engine

def main():
    with engine.begin() as connection:
        connection.execute(
            text("""
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE;
            """)
        )

    print("✅ Colonne is_published créée ou déjà existante.")

if __name__ == "__main__":
    main()