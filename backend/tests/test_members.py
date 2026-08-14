from uuid import UUID

from fastapi.testclient import TestClient


MEMBER_PAYLOAD = {
    "member_number": "MEM-TEST-0001",
    "national_id": "TEST-NID-0001",
    "first_name": "Ahmed",
    "middle_name": "Mohammed",
    "last_name": "Al-Fahad",
    "date_of_birth": "1985-06-15",
    "gender": "Male",
    "email": "ahmed.test@example.com",
    "phone": "+966501111111",
    "city": "Riyadh",
    "region": "Riyadh",
    "country": "Saudi Arabia",
    "enrollment_status": "active",
    "is_active": True,
}


def create_member(client: TestClient) -> dict:
    response = client.post(
        "/api/v1/members",
        json=MEMBER_PAYLOAD,
    )

    assert response.status_code == 201
    return response.json()


def test_create_member(client: TestClient) -> None:
    member = create_member(client)

    assert member["member_number"] == "MEM-TEST-0001"
    assert member["first_name"] == "Ahmed"
    assert member["enrollment_status"] == "active"
    assert member["is_active"] is True

    UUID(member["id"])


def test_list_members(client: TestClient) -> None:
    create_member(client)

    response = client.get("/api/v1/members")

    assert response.status_code == 200

    members = response.json()

    assert len(members) == 1
    assert members[0]["member_number"] == "MEM-TEST-0001"


def test_get_member_by_id(client: TestClient) -> None:
    member = create_member(client)

    response = client.get(
        f"/api/v1/members/{member['id']}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == member["id"]
    assert response.json()["last_name"] == "Al-Fahad"


def test_update_member(client: TestClient) -> None:
    member = create_member(client)

    response = client.put(
        f"/api/v1/members/{member['id']}",
        json={
            "phone": "+966502222222",
            "city": "Jeddah",
            "region": "Makkah",
        },
    )

    assert response.status_code == 200

    updated_member = response.json()

    assert updated_member["phone"] == "+966502222222"
    assert updated_member["city"] == "Jeddah"
    assert updated_member["region"] == "Makkah"


def test_duplicate_member_number_is_rejected(
    client: TestClient,
) -> None:
    create_member(client)

    duplicate_payload = MEMBER_PAYLOAD.copy()
    duplicate_payload["national_id"] = "TEST-NID-0002"

    response = client.post(
        "/api/v1/members",
        json=duplicate_payload,
    )

    assert response.status_code == 409
    assert "member number" in response.json()["detail"].lower()


def test_duplicate_national_id_is_rejected(
    client: TestClient,
) -> None:
    create_member(client)

    duplicate_payload = MEMBER_PAYLOAD.copy()
    duplicate_payload["member_number"] = "MEM-TEST-0002"

    response = client.post(
        "/api/v1/members",
        json=duplicate_payload,
    )

    assert response.status_code == 409
    assert "national id" in response.json()["detail"].lower()


def test_filter_members_by_city(client: TestClient) -> None:
    create_member(client)

    response = client.get(
        "/api/v1/members",
        params={"city": "Riyadh"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["city"] == "Riyadh"


def test_filter_members_by_enrollment_status(
    client: TestClient,
) -> None:
    create_member(client)

    response = client.get(
        "/api/v1/members",
        params={
            "enrollment_status": "active",
            "is_active": True,
        },
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_member_not_found(client: TestClient) -> None:
    response = client.get(
        "/api/v1/members/"
        "00000000-0000-0000-0000-000000000001"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Member not found."


def test_delete_member(client: TestClient) -> None:
    member = create_member(client)

    delete_response = client.delete(
        f"/api/v1/members/{member['id']}"
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/v1/members/{member['id']}"
    )

    assert get_response.status_code == 404