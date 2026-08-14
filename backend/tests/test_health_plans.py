from uuid import UUID

from fastapi.testclient import TestClient


HEALTH_PLAN_PAYLOAD = {
    "plan_code": "TEST-GOLD-PPO-001",
    "plan_name": "Test Gold Plus PPO",
    "plan_type": "PPO",
    "coverage_level": "Gold",
    "annual_deductible": 500,
    "out_of_pocket_maximum": 5000,
    "monthly_premium": 850,
    "coinsurance_percentage": 20,
    "primary_care_copay": 50,
    "specialist_copay": 100,
    "effective_date": "2026-01-01",
    "expiration_date": "2026-12-31",
    "currency": "SAR",
    "is_active": True,
}


def create_health_plan(client: TestClient) -> dict:
    response = client.post(
        "/api/v1/health-plans",
        json=HEALTH_PLAN_PAYLOAD,
    )

    assert response.status_code == 201
    return response.json()


def test_create_health_plan(client: TestClient) -> None:
    health_plan = create_health_plan(client)

    assert health_plan["plan_code"] == "TEST-GOLD-PPO-001"
    assert health_plan["plan_name"] == "Test Gold Plus PPO"
    assert health_plan["plan_type"] == "PPO"
    assert health_plan["coverage_level"] == "Gold"
    assert health_plan["currency"] == "SAR"
    assert health_plan["is_active"] is True

    UUID(health_plan["id"])


def test_list_health_plans(client: TestClient) -> None:
    create_health_plan(client)

    response = client.get("/api/v1/health-plans")

    assert response.status_code == 200

    plans = response.json()

    assert len(plans) == 1
    assert plans[0]["plan_code"] == "TEST-GOLD-PPO-001"


def test_get_health_plan_by_id(client: TestClient) -> None:
    health_plan = create_health_plan(client)

    response = client.get(
        f"/api/v1/health-plans/{health_plan['id']}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == health_plan["id"]


def test_update_health_plan(client: TestClient) -> None:
    health_plan = create_health_plan(client)

    response = client.put(
        f"/api/v1/health-plans/{health_plan['id']}",
        json={
            "monthly_premium": 900,
            "specialist_copay": 120,
            "coverage_level": "Platinum",
        },
    )

    assert response.status_code == 200

    updated_plan = response.json()

    assert updated_plan["monthly_premium"] == "900.00"
    assert updated_plan["specialist_copay"] == "120.00"
    assert updated_plan["coverage_level"] == "Platinum"


def test_duplicate_plan_code_is_rejected(
    client: TestClient,
) -> None:
    create_health_plan(client)

    duplicate_payload = HEALTH_PLAN_PAYLOAD.copy()
    duplicate_payload["plan_name"] = "Another Gold Plan"

    response = client.post(
        "/api/v1/health-plans",
        json=duplicate_payload,
    )

    assert response.status_code == 409
    assert "plan code" in response.json()["detail"].lower()


def test_filter_health_plans_by_type(
    client: TestClient,
) -> None:
    create_health_plan(client)

    response = client.get(
        "/api/v1/health-plans",
        params={"plan_type": "PPO"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["plan_type"] == "PPO"


def test_filter_health_plans_by_coverage_level(
    client: TestClient,
) -> None:
    create_health_plan(client)

    response = client.get(
        "/api/v1/health-plans",
        params={"coverage_level": "Gold"},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_invalid_date_range_is_rejected(
    client: TestClient,
) -> None:
    invalid_payload = HEALTH_PLAN_PAYLOAD.copy()
    invalid_payload["plan_code"] = "INVALID-DATE-001"
    invalid_payload["effective_date"] = "2026-12-31"
    invalid_payload["expiration_date"] = "2026-01-01"

    response = client.post(
        "/api/v1/health-plans",
        json=invalid_payload,
    )

    assert response.status_code == 422


def test_health_plan_not_found(client: TestClient) -> None:
    response = client.get(
        "/api/v1/health-plans/"
        "00000000-0000-0000-0000-000000000001"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Health plan not found."


def test_delete_health_plan(client: TestClient) -> None:
    health_plan = create_health_plan(client)

    delete_response = client.delete(
        f"/api/v1/health-plans/{health_plan['id']}"
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/v1/health-plans/{health_plan['id']}"
    )

    assert get_response.status_code == 404