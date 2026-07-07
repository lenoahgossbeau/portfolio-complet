# tests/test_final.py
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app, requests_counter

client = TestClient(app)


def test_final():
    """Test final qui prouve que le rate limiter fonctionne"""
    print("🧪 TEST FINAL DU RATE LIMITER")
    print("=" * 60)

    # Réinitialisation
    requests_counter.clear()

    # 1️⃣ 100 requêtes autorisées
    print("\n1. Test de 100 requêtes autorisées...")
    for i in range(100):
        response = client.get(f"/test{i}")
        assert response.status_code in (404, 200)

    print("   ✅ 100 requêtes autorisées")

    # 2️⃣ 101ème requête BLOQUÉE
    print("\n2. Test de la 101ème requête...")
    response = client.get("/test101")

    assert response.status_code == 429, (
        f"Attendu 429 mais reçu {response.status_code}"
    )

    data = response.json()
    assert "Trop de requêtes" in data.get("error", "")
    assert "100 requêtes" in data.get("message", "")

    print("   ✅ BLOQUÉE (429)")
    print(f"   Message: {data.get('error')}")
    print(f"   Détails: {data.get('message')}")

    print("\n" + "=" * 60)
    print("🎉 TEST RÉUSSI ! Le rate limiter fonctionne parfaitement.")
    print("=" * 60)
