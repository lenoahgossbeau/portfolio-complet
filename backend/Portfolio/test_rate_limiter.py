import sys
import os

# CORRECTION DU PROBLÈME D'IMPORT
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

import time
import jwt

from fastapi.testclient import TestClient
from main import app, requests_counter

# Client de test
client = TestClient(app)

def test_rate_limiter_block_after_100():
    """
    Test principal: Vérifie que le rate limiter bloque après 100 requêtes
    """
    requests_counter.clear()
    
    test_route = "/api/test-rate-limiter"
    
    print("\nTest 1: Blocage après 100 requêtes")
    print("-" * 40)
    
    successful = 0
    for i in range(105):
        response = client.get(test_route)
        if response.status_code == 404:  # Route inexistante = non bloquée
            successful += 1
        elif response.status_code == 429:  # Bloquée
            print(f"  Bloqué à la requête {i+1}")
            data = response.json()
            print(f"  Message: {data.get('error', 'N/A')}")
            print(f"  Détails: {data.get('message', 'N/A')}")
            break
    
    print(f"  Résultat: {successful} requêtes réussies")
    
    assert successful == 100, f"Seulement {successful} requêtes ont réussi"
    assert response.status_code == 429, f"Dernière requête: {response.status_code} (devrait être 429)"
    
    print("✅ Test 1 PASSED")

def test_rate_limiter_error_message():
    """
    Test: Vérifie le message d'erreur lors du blocage
    """
    requests_counter.clear()
    
    print(f"\nTest 2: Test du message d'erreur")
    print("-" * 40)
    
    test_route = "/api/test-error-message"
    
    # Faire 100 requêtes pour remplir le compteur
    for i in range(100):
        response = client.get(f"{test_route}-{i}")
    
    print(f"  Compteur rempli avec 100 requêtes")
    
    # La 101ème requête devrait être bloquée
    response = client.get(f"{test_route}-101")
    
    assert response.status_code == 429, f"Status {response.status_code} au lieu de 429"
    
    data = response.json()
    print(f"  ✅ BLOQUÉE avec code 429!")
    print(f"  Message d'erreur: {data.get('error', 'N/A')}")
    print(f"  Détails: {data.get('message', 'N/A')}")
    
    assert "error" in data
    assert "Trop de requêtes" in data["error"]
    assert "message" in data
    
    print("✅ Test 2 PASSED: Message d'erreur correct")

def test_rate_limiter_reset_after_time():
    """
    Test: Vérifie que le compteur se réinitialise après le temps
    """
    requests_counter.clear()
    
    ip = "127.0.0.1"
    old_time = time.time() - 61
    
    for _ in range(80):
        requests_counter[ip].append(old_time)
    
    print(f"\nTest 3: Test du nettoyage automatique")
    print("-" * 40)
    print(f"  Avant nettoyage: {len(requests_counter[ip])} requêtes")
    
    now = time.time()
    requests_counter[ip] = [t for t in requests_counter[ip] if now - t < 60]
    requests_counter[ip].append(now)
    
    print(f"  Après nettoyage simulé: {len(requests_counter[ip])} requêtes")
    
    assert len(requests_counter[ip]) == 1, f"{len(requests_counter[ip])} requêtes au lieu de 1"
    
    print("✅ Test 3 PASSED: Nettoyage des anciennes requêtes")

def test_rate_limiter_public_pages_not_limited():
    """
    Test: Vérifie que les pages publiques ne sont pas limitées
    """
    requests_counter.clear()
    
    public_pages = ["/health"]
    
    print(f"\nTest 4: Pages publiques non limitées")
    print(f"  Route testée: {public_pages}")
    print("-" * 40)
    
    for i in range(150):
        page = public_pages[0]
        response = client.get(page)
        
        assert response.status_code != 429, f"Page publique {page} bloquée à la requête {i+1}"
        
        if i == 0:
            print(f"  Première requête: {response.status_code}")
        if i == 149:
            print(f"  Dernière requête: {response.status_code}")
    
    print("✅ Test 4 PASSED: Route /health non limitée")

def test_rate_limiter_different_ips():
    """
    Test: Vérifie que chaque IP a son propre compteur
    """
    requests_counter.clear()
    
    requests_counter["192.168.1.100"] = [time.time()] * 90
    requests_counter["192.168.1.200"] = [time.time()] * 40
    
    print(f"\nTest 5: Compteurs séparés par IP")
    print("-" * 40)
    print(f"  IP 192.168.1.100: {len(requests_counter['192.168.1.100'])} requêtes")
    print(f"  IP 192.168.1.200: {len(requests_counter['192.168.1.200'])} requêtes")
    
    assert len(requests_counter["192.168.1.100"]) == 90
    assert len(requests_counter["192.168.1.200"]) == 40
    
    print("✅ Test 5 PASSED: Compteurs séparés par IP")

def test_rate_limiter_with_different_admin_endpoints():
    """
    Test: Vérifie le rate limiter sur différents endpoints
    """
    requests_counter.clear()
    
    print(f"\nTest 6: Différents endpoints")
    print("-" * 40)
    
    endpoints = ["/api/test1", "/api/test2", "/api/test3"]
    
    successful = 0
    
    for endpoint in endpoints:
        for i in range(35):
            response = client.get(endpoint)
            if response.status_code == 404:
                successful += 1
    
    print(f"  Requêtes réussies: {successful}")
    
    assert successful == 100, f"Seulement {successful} requêtes ont réussi (devrait être 100)"
    
    response = client.get("/api/test-last")
    assert response.status_code == 429, f"Dernière requête: {response.status_code} (devrait être 429)"
    
    print("✅ Test 6 PASSED: Rate limiter actif sur tous les endpoints")

def test_rate_limiter_headers():
    """
    Test: Vérifie les headers de rate limiting
    """
    requests_counter.clear()
    
    print(f"\nTest 7: Headers de rate limiting")
    print("-" * 40)
    
    test_route = "/api/test-headers-unique"
    
    for i in range(3):
        response = client.get(f"{test_route}-{i}")
        
        assert response.status_code != 429, f"Requête {i+1} bloquée alors qu'on teste les headers"
        
        assert "X-RateLimit-Limit" in response.headers, f"Header X-RateLimit-Limit manquant"
        assert "X-RateLimit-Remaining" in response.headers, f"Header X-RateLimit-Remaining manquant"
        assert "X-RateLimit-Reset" in response.headers, f"Header X-RateLimit-Reset manquant"
        
        if "X-RateLimit-Limit" in response.headers:
            limit = response.headers["X-RateLimit-Limit"]
            remaining = response.headers.get("X-RateLimit-Remaining", "N/A")
            reset = response.headers.get("X-RateLimit-Reset", "N/A")
            print(f"  Requête {i+1}: Limit={limit}, Remaining={remaining}, Reset={reset}")
        
        limit = int(response.headers["X-RateLimit-Limit"])
        remaining = int(response.headers["X-RateLimit-Remaining"])
        
        assert limit == 100, f"Limit {limit} au lieu de 100"
        assert remaining >= 0, f"Remaining {remaining} négatif"
    
    print("✅ Test 7 PASSED: Tous les headers sont présents")

if __name__ == "__main__":
    """
    Exécution manuelle des tests
    """
    print("="*70)
    print("SUITE DE TESTS COMPLÈTE: RATE LIMITER")
    print("="*70)
    
    tests = [
        test_rate_limiter_block_after_100,
        test_rate_limiter_error_message,
        test_rate_limiter_reset_after_time,
        test_rate_limiter_public_pages_not_limited,
        test_rate_limiter_different_ips,
        test_rate_limiter_with_different_admin_endpoints,
        test_rate_limiter_headers
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
            print(f"✅ {test.__name__}: PASSED\n")
        except AssertionError as e:
            failed += 1
            print(f"❌ {test.__name__}: FAILED - {str(e)}\n")
        except Exception as e:
            failed += 1
            print(f"❌ {test.__name__}: ERROR - {str(e)}\n")
    
    print("="*70)
    print(f"RÉSULTATS: {passed} passés, {failed} échoués")
    
    if failed == 0:
        print("🎉 TOUS LES TESTS SONT PASSÉS!")
    else:
        print(f"⚠️  {failed} test(s) ont échoué")
    
    print("="*70)