from uuid import UUID

from fastapi.testclient import TestClient


MEMBER_PAYLOAD = {
    "member_number": "MEM-ENROLL-0001",
    "national_id": "NID-ENROLL-0001",
    "first_name": "Ahmed",
    "middle_name": "Mohammed",
    "last_name": "Al-Fahad",
    "date_of_birth": "1985-06-15",
    "gender": "Male",
    "email": "ahmed.enrollment@example.com",
    "phone": "+966501111111",
    "city": "Riyadh",
    "region": "Riyadh",
    "country": "Saudi Arabia",
    "enrollment_status": "active",
    "is_active": True,
}


HEALTH_PLAN_PAYLOAD = {
    "plan_code": "ENROLL-GOLD-PPO-001",
    "plan_name": "Enrollment Gold Plus PPO",
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


def create_member(client: TestClient) -> dict:
    response = client.post(
        "/api/v1/members",
        json=MEMBER_PAYLOAD,
    )

    assert response.status_code == 201
    return response.json()


def create_health_plan(client: TestClient) -> dict:
    response = client.post(
        "/api/v1/health-plans",
        json=HEALTH_PLAN_PAYLOAD,
    )

    assert response.status_code == 201
    return response.json()


def build_enrollment_payload(
    member_id: str,
    health_plan_id: str,
    policy_number: str = "POL-TEST-2026-0001",
) -> dict:
    return {
        "member_id": member_id,
        "health_plan_id": health_plan_id,
        "policy_number": policy_number,
        "enrollment_type": "individual",
        "relationship_to_subscriber": "self",
        "subscriber_member_id": None,
        "group_number": "GRP-RYD-001",
        "employer_name": "MediVantage Solutions",
        "coverage_start_date": "2026-01-01",
        "coverage_end_date": "2026-12-31",
        "enrollment_status": "active",
        "termination_reason": None,
        "is_primary": True,
        "is_active": True,
    }


def create_enrollment(
    client: TestClient,
    member_id: str,
    health_plan_id: str,
    policy_number: str = "POL-TEST-2026-0001",
) -> dict:
    response = client.post(
        "/api/v1/enrollments",
        json=build_enrollment_payload(
            member_id=member_id,
            health_plan_id=health_plan_id,
            policy_number=policy_number,
        ),
    )

    assert response.status_code == 201
    return response.json()


def test_create_enrollment(client: TestClient) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    enrollment = create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    assert enrollment["member_id"] == member["id"]
    assert enrollment["health_plan_id"] == health_plan["id"]
    assert enrollment["policy_number"] == "POL-TEST-2026-0001"
    assert enrollment["enrollment_type"] == "individual"
    assert enrollment["relationship_to_subscriber"] == "self"
    assert enrollment["enrollment_status"] == "active"
    assert enrollment["is_primary"] is True
    assert enrollment["is_active"] is True

    UUID(enrollment["id"])


def test_list_enrollments(client: TestClient) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.get("/api/v1/enrollments")

    assert response.status_code == 200

    enrollments = response.json()

    assert len(enrollments) == 1
    assert enrollments[0]["policy_number"] == "POL-TEST-2026-0001"


def test_get_enrollment_by_id(client: TestClient) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    enrollment = create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.get(
        f"/api/v1/enrollments/{enrollment['id']}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == enrollment["id"]


def test_update_enrollment(client: TestClient) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    enrollment = create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.put(
        f"/api/v1/enrollments/{enrollment['id']}",
        json={
            "employer_name": "MetroCare Health System",
            "group_number": "GRP-RYD-002",
            "is_primary": False,
        },
    )

    assert response.status_code == 200

    updated_enrollment = response.json()

    assert (
        updated_enrollment["employer_name"]
        == "MetroCare Health System"
    )
    assert updated_enrollment["group_number"] == "GRP-RYD-002"
    assert updated_enrollment["is_primary"] is False
    assert updated_enrollment["policy_number"] == "POL-TEST-2026-0001"


def test_filter_enrollments_by_member_id(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.get(
        "/api/v1/enrollments",
        params={"member_id": member["id"]},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["member_id"] == member["id"]


def test_filter_enrollments_by_health_plan_id(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.get(
        "/api/v1/enrollments",
        params={"health_plan_id": health_plan["id"]},
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert (
        response.json()[0]["health_plan_id"]
        == health_plan["id"]
    )


def test_filter_active_enrollments(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.get(
        "/api/v1/enrollments",
        params={
            "enrollment_status": "active",
            "is_active": True,
        },
    )

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["enrollment_status"] == "active"
    assert response.json()[0]["is_active"] is True


def test_duplicate_policy_number_is_rejected(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.post(
        "/api/v1/enrollments",
        json=build_enrollment_payload(
            member_id=member["id"],
            health_plan_id=health_plan["id"],
            policy_number="POL-TEST-2026-0001",
        ),
    )

    assert response.status_code == 409
    assert response.json()["detail"] == (
        "Policy number already exists."
    )


def test_member_not_found_when_creating_enrollment(
    client: TestClient,
) -> None:
    health_plan = create_health_plan(client)

    response = client.post(
        "/api/v1/enrollments",
        json=build_enrollment_payload(
            member_id=(
                "00000000-0000-0000-0000-000000000001"
            ),
            health_plan_id=health_plan["id"],
        ),
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Member not found."


def test_health_plan_not_found_when_creating_enrollment(
    client: TestClient,
) -> None:
    member = create_member(client)

    response = client.post(
        "/api/v1/enrollments",
        json=build_enrollment_payload(
            member_id=member["id"],
            health_plan_id=(
                "00000000-0000-0000-0000-000000000002"
            ),
        ),
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Health plan not found."


def test_inactive_health_plan_is_rejected(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    update_response = client.put(
        f"/api/v1/health-plans/{health_plan['id']}",
        json={"is_active": False},
    )

    assert update_response.status_code == 200

    response = client.post(
        "/api/v1/enrollments",
        json=build_enrollment_payload(
            member_id=member["id"],
            health_plan_id=health_plan["id"],
        ),
    )

    assert response.status_code == 409
    assert response.json()["detail"] == (
        "Health plan is not active."
    )


def test_invalid_coverage_date_range_is_rejected(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    payload = build_enrollment_payload(
        member_id=member["id"],
        health_plan_id=health_plan["id"],
        policy_number="POL-INVALID-DATE-001",
    )

    payload["coverage_start_date"] = "2026-12-31"
    payload["coverage_end_date"] = "2026-01-01"

    response = client.post(
        "/api/v1/enrollments",
        json=payload,
    )

    assert response.status_code == 422


def test_dependent_requires_subscriber_member_id(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    payload = build_enrollment_payload(
        member_id=member["id"],
        health_plan_id=health_plan["id"],
        policy_number="POL-DEPENDENT-001",
    )

    payload["enrollment_type"] = "family"
    payload["relationship_to_subscriber"] = "child"
    payload["subscriber_member_id"] = None
    payload["is_primary"] = False

    response = client.post(
        "/api/v1/enrollments",
        json=payload,
    )

    assert response.status_code == 422


def test_invalid_date_range_during_update_is_rejected(
    client: TestClient,
) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    enrollment = create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = client.put(
        f"/api/v1/enrollments/{enrollment['id']}",
        json={
            "coverage_start_date": "2026-12-31",
            "coverage_end_date": "2026-01-01",
        },
    )

    assert response.status_code == 422
    assert response.json()["detail"] == (
        "Coverage end date cannot be earlier than "
        "coverage start date."
    )


def test_enrollment_not_found(client: TestClient) -> None:
    response = client.get(
        "/api/v1/enrollments/"
        "00000000-0000-0000-0000-000000000001"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Enrollment not found."


def test_delete_enrollment(client: TestClient) -> None:
    member = create_member(client)
    health_plan = create_health_plan(client)

    enrollment = create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    delete_response = client.delete(
        f"/api/v1/enrollments/{enrollment['id']}"
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/v1/enrollments/{enrollment['id']}"
    )

    assert get_response.status_code == 404
    assert get_response.json()["detail"] == (
        "Enrollment not found."
    )