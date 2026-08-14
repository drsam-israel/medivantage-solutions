from fastapi.testclient import TestClient


UNKNOWN_MEMBER_ID = "00000000-0000-0000-0000-000000000001"
UNKNOWN_PROVIDER_ID = "00000000-0000-0000-0000-000000000002"


MEMBER_PAYLOAD = {
    "member_number": "MEM-ELIG-0001",
    "national_id": "NID-ELIG-0001",
    "first_name": "Ahmed",
    "middle_name": "Mohammed",
    "last_name": "Al-Fahad",
    "date_of_birth": "1985-06-15",
    "gender": "Male",
    "email": "ahmed.eligibility@example.com",
    "phone": "+966502222222",
    "city": "Riyadh",
    "region": "Riyadh",
    "country": "Saudi Arabia",
    "enrollment_status": "active",
    "is_active": True,
}


PROVIDER_PAYLOAD = {
    "provider_code": "PRV-ELIG-0001",
    "provider_name": "Riyadh Advanced Medical Center",
    "provider_type": "Hospital",
    "specialty": "General Medicine",
    "license_number": "LIC-ELIG-0001",
    "phone": "+966113333333",
    "email": "eligibility@riyadhmedical.example.com",
    "address_line_1": "King Fahd Road",
    "city": "Riyadh",
    "region": "Riyadh",
    "country": "Saudi Arabia",
    "network_status": "in_network",
    "is_active": True,
}


HEALTH_PLAN_PAYLOAD = {
    "plan_code": "ELIG-GOLD-PPO-001",
    "plan_name": "Gold Plus PPO",
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


def create_provider(client: TestClient) -> dict:
    response = client.post(
        "/api/v1/providers",
        json=PROVIDER_PAYLOAD,
    )

    assert response.status_code == 201
    return response.json()


def create_health_plan(
    client: TestClient,
    *,
    effective_date: str = "2026-01-01",
    expiration_date: str = "2026-12-31",
    is_active: bool = True,
) -> dict:
    payload = {
        **HEALTH_PLAN_PAYLOAD,
        "effective_date": effective_date,
        "expiration_date": expiration_date,
        "is_active": is_active,
    }

    response = client.post(
        "/api/v1/health-plans",
        json=payload,
    )

    assert response.status_code == 201
    return response.json()


def create_enrollment(
    client: TestClient,
    member_id: str,
    health_plan_id: str,
    *,
    policy_number: str = "POL-KSA-2026-0001",
    coverage_start_date: str = "2026-01-01",
    coverage_end_date: str | None = "2026-12-31",
    enrollment_status: str = "active",
    is_active: bool = True,
) -> dict:
    payload = {
        "member_id": member_id,
        "health_plan_id": health_plan_id,
        "policy_number": policy_number,
        "enrollment_type": "individual",
        "relationship_to_subscriber": "self",
        "subscriber_member_id": None,
        "group_number": "GRP-RYD-ELIG-001",
        "employer_name": "MediVantage Solutions",
        "coverage_start_date": coverage_start_date,
        "coverage_end_date": coverage_end_date,
        "enrollment_status": enrollment_status,
        "termination_reason": None,
        "is_primary": True,
        "is_active": is_active,
    }

    response = client.post(
        "/api/v1/enrollments",
        json=payload,
    )

    assert response.status_code == 201
    return response.json()


def verify_eligibility(
    client: TestClient,
    member_id: str,
    provider_id: str,
    service_date: str = "2026-06-15",
):
    return client.post(
        "/api/v1/eligibility/verify",
        json={
            "member_id": member_id,
            "provider_id": provider_id,
            "service_date": service_date,
        },
    )


def test_member_is_eligible_for_active_coverage(
    client: TestClient,
) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is True
    assert result["member_id"] == member["id"]
    assert result["member_name"] == "Ahmed Al-Fahad"
    assert result["policy_number"] == "POL-KSA-2026-0001"
    assert result["plan_name"] == "Gold Plus PPO"
    assert result["coverage_status"] == "ACTIVE"
    assert result["effective_date"] == "2026-01-01"
    assert result["expiration_date"] == "2026-12-31"
    assert result["message"] == (
        "Member is eligible for covered services on the "
        "requested service date."
    )


def test_member_not_found(client: TestClient) -> None:
    provider = create_provider(client)

    response = verify_eligibility(
        client,
        UNKNOWN_MEMBER_ID,
        provider["id"],
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["member_id"] == UNKNOWN_MEMBER_ID
    assert result["member_name"] == "Unknown member"
    assert result["policy_number"] is None
    assert result["plan_name"] is None
    assert result["coverage_status"] == "MEMBER_NOT_FOUND"
    assert result["effective_date"] is None
    assert result["expiration_date"] is None
    assert result["message"] == "Member record was not found."


def test_provider_not_found(client: TestClient) -> None:
    member = create_member(client)

    response = verify_eligibility(
        client,
        member["id"],
        UNKNOWN_PROVIDER_ID,
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["member_id"] == member["id"]
    assert result["member_name"] == "Ahmed Al-Fahad"
    assert result["coverage_status"] == "PROVIDER_NOT_FOUND"
    assert result["policy_number"] is None
    assert result["plan_name"] is None
    assert result["message"] == "Provider record was not found."


def test_no_enrollment_found(client: TestClient) -> None:
    member = create_member(client)
    provider = create_provider(client)

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "NO_ENROLLMENT"
    assert result["policy_number"] is None
    assert result["plan_name"] is None
    assert result["effective_date"] is None
    assert result["expiration_date"] is None
    assert result["message"] == (
        "No enrollment was found for this member."
    )


def test_coverage_not_started(client: TestClient) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        coverage_start_date="2026-07-01",
        coverage_end_date="2026-12-31",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
        service_date="2026-06-15",
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "COVERAGE_NOT_STARTED"
    assert result["effective_date"] == "2026-07-01"
    assert result["expiration_date"] == "2026-12-31"
    assert result["message"] == (
        "Coverage had not started on the requested service date."
    )


def test_coverage_expired(client: TestClient) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        coverage_start_date="2026-01-01",
        coverage_end_date="2026-05-31",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
        service_date="2026-06-15",
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "COVERAGE_EXPIRED"
    assert result["effective_date"] == "2026-01-01"
    assert result["expiration_date"] == "2026-05-31"
    assert result["message"] == (
        "Coverage expired before the requested service date."
    )


def test_inactive_enrollment(client: TestClient) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        is_active=False,
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "INACTIVE_ENROLLMENT"
    assert result["message"] == (
        "The member's enrollment is inactive."
    )


def test_enrollment_status_does_not_allow_eligibility(
    client: TestClient,
) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        enrollment_status="terminated",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "ENROLLMENT_NOT_ACTIVE"
    assert result["message"] == (
        "The enrollment status does not permit eligibility."
    )


def test_inactive_health_plan(client: TestClient) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
    )

    update_response = client.put(
        f"/api/v1/health-plans/{health_plan['id']}",
        json={"is_active": False},
    )

    assert update_response.status_code == 200

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "HEALTH_PLAN_INACTIVE"
    assert result["message"] == (
        "The member's health plan is inactive."
    )


def test_health_plan_not_yet_effective(
    client: TestClient,
) -> None:
    member = create_member(client)
    provider = create_provider(client)

    health_plan = create_health_plan(
        client,
        effective_date="2026-07-01",
        expiration_date="2026-12-31",
    )

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        coverage_start_date="2026-01-01",
        coverage_end_date="2026-12-31",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
        service_date="2026-06-15",
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "PLAN_NOT_YET_EFFECTIVE"
    assert result["message"] == (
        "The health plan is not effective on the requested "
        "service date."
    )


def test_health_plan_expired(client: TestClient) -> None:
    member = create_member(client)
    provider = create_provider(client)

    health_plan = create_health_plan(
        client,
        effective_date="2026-01-01",
        expiration_date="2026-05-31",
    )

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        coverage_start_date="2026-01-01",
        coverage_end_date="2026-12-31",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
        service_date="2026-06-15",
    )

    assert response.status_code == 200

    result = response.json()

    assert result["eligible"] is False
    assert result["coverage_status"] == "PLAN_EXPIRED"
    assert result["message"] == (
        "The health plan expired before the requested "
        "service date."
    )


def test_approved_enrollment_status_is_eligible(
    client: TestClient,
) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        enrollment_status="approved",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200
    assert response.json()["eligible"] is True
    assert response.json()["coverage_status"] == "ACTIVE"


def test_in_force_enrollment_status_is_eligible(
    client: TestClient,
) -> None:
    member = create_member(client)
    provider = create_provider(client)
    health_plan = create_health_plan(client)

    create_enrollment(
        client,
        member["id"],
        health_plan["id"],
        enrollment_status="in_force",
    )

    response = verify_eligibility(
        client,
        member["id"],
        provider["id"],
    )

    assert response.status_code == 200
    assert response.json()["eligible"] is True
    assert response.json()["coverage_status"] == "ACTIVE"


def test_invalid_member_uuid_is_rejected(
    client: TestClient,
) -> None:
    provider = create_provider(client)

    response = client.post(
        "/api/v1/eligibility/verify",
        json={
            "member_id": "invalid-member-id",
            "provider_id": provider["id"],
            "service_date": "2026-06-15",
        },
    )

    assert response.status_code == 422


def test_invalid_provider_uuid_is_rejected(
    client: TestClient,
) -> None:
    member = create_member(client)

    response = client.post(
        "/api/v1/eligibility/verify",
        json={
            "member_id": member["id"],
            "provider_id": "invalid-provider-id",
            "service_date": "2026-06-15",
        },
    )

    assert response.status_code == 422


def test_invalid_service_date_is_rejected(
    client: TestClient,
) -> None:
    member = create_member(client)
    provider = create_provider(client)

    response = client.post(
        "/api/v1/eligibility/verify",
        json={
            "member_id": member["id"],
            "provider_id": provider["id"],
            "service_date": "not-a-date",
        },
    )

    assert response.status_code == 422