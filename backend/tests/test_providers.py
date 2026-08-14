from uuid import UUID

from fastapi.testclient import TestClient


PROVIDER_PAYLOAD = {
    "provider_code": "TEST001",
    "provider_name": "MediVantage Test Hospital",
    "provider_type": "Hospital",
    "specialty": "Multi-Specialty",
    "license_number": "TEST-LIC-001",
    "network_status": "in_network",
    "email": "provider@example.com",
    "phone": "+966110000000",
    "city": "Riyadh",
    "region": "Riyadh",
    "country": "Saudi Arabia",
    "is_active": True,
}


def create_provider(client: TestClient) -> dict:
    response = client.post(
        "/api/v1/providers",
        json=PROVIDER_PAYLOAD,
    )

    assert response.status_code == 201
    return response.json()


def test_create_provider(client: TestClient) -> None:
    provider = create_provider(client)

    assert provider["provider_code"] == "TEST001"
    assert provider["provider_name"] == "MediVantage Test Hospital"
    assert provider["is_active"] is True

    UUID(provider["id"])


def test_list_providers(client: TestClient) -> None:
    create_provider(client)

    response = client.get("/api/v1/providers")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["provider_code"] == "TEST001"


def test_get_provider_by_id(client: TestClient) -> None:
    provider = create_provider(client)

    response = client.get(
        f"/api/v1/providers/{provider['id']}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == provider["id"]


def test_update_provider(client: TestClient) -> None:
    provider = create_provider(client)

    response = client.put(
        f"/api/v1/providers/{provider['id']}",
        json={
            "specialty": "Tertiary Care",
            "network_status": "preferred_network",
        },
    )

    assert response.status_code == 200
    assert response.json()["specialty"] == "Tertiary Care"
    assert response.json()["network_status"] == "preferred_network"


def test_duplicate_provider_code_is_rejected(
    client: TestClient,
) -> None:
    create_provider(client)

    duplicate_payload = PROVIDER_PAYLOAD.copy()
    duplicate_payload["license_number"] = "TEST-LIC-002"

    response = client.post(
        "/api/v1/providers",
        json=duplicate_payload,
    )

    assert response.status_code == 409
    assert "provider code" in response.json()["detail"].lower()


def test_filter_providers_by_city(client: TestClient) -> None:
    create_provider(client)

    response = client.get(
        "/api/v1/providers",
        params={"city": "Riyadh"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_provider_not_found(client: TestClient) -> None:
    response = client.get(
        "/api/v1/providers/"
        "00000000-0000-0000-0000-000000000001"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Provider not found."


def test_delete_provider(client: TestClient) -> None:
    provider = create_provider(client)

    delete_response = client.delete(
        f"/api/v1/providers/{provider['id']}"
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/v1/providers/{provider['id']}"
    )

    assert get_response.status_code == 404