from fastapi import APIRouter, Depends, Request
from app.core.auth import get_auth_headers
from app.core.backend_client import backend_client
from app.schemas.dto import UnifiedSessionDTO, OnboardingStateDTO
from app.schemas.envelope import success_envelope, inject_request_id

router = APIRouter()


def compute_onboarding_state(user, volunteer, org) -> OnboardingStateDTO:
    if not user:
        return OnboardingStateDTO(state="NOT_STARTED", completionPercentage=0, missingFields=["user"])

    if not volunteer and not org:
        return OnboardingStateDTO(state="ROLE_SELECTED", completionPercentage=20, missingFields=["role"])
    
    missing_fields = []
    state = "NOT_STARTED"
    pct = 0

    if volunteer:
        if not volunteer.get("fullName"): missing_fields.append("fullName")
        if not volunteer.get("phoneNumber"): missing_fields.append("phoneNumber")
        if not volunteer.get("operationalRegions"): missing_fields.append("operationalRegions")
        
        if missing_fields:
            state = "VOLUNTEER_PROFILE_INCOMPLETE"
            pct = 50
        elif volunteer.get("verificationStatus") == "UNVERIFIED":
            state = "PENDING_VERIFICATION"
            pct = 90
        else:
            state = "COMPLETED"
            pct = 100
            
    elif org:
        if not org.get("legalName"): missing_fields.append("legalName")
        if not org.get("registrationNumber"): missing_fields.append("registrationNumber")
        if not org.get("operationalRegions"): missing_fields.append("operationalRegions")
        
        if missing_fields:
            state = "NGO_PROFILE_INCOMPLETE"
            pct = 50
        elif org.get("verificationStatus") == "UNVERIFIED":
            state = "PENDING_VERIFICATION"
            pct = 90
        else:
            state = "COMPLETED"
            pct = 100

    return OnboardingStateDTO(
        state=state,
        completionPercentage=pct,
        missingFields=missing_fields
    )


async def _build_session(headers: dict) -> UnifiedSessionDTO:
    """Internal helper: build a UnifiedSessionDTO from backend sources."""
    user_data = None
    try:
        user_res = await backend_client.get("/api/users/me", headers=headers)
        user_data = user_res.json().get("data")
    except Exception:
        pass
        
    if not user_data:
        return UnifiedSessionDTO(authenticated=False)

    volunteer_data = None
    try:
        vol_res = await backend_client.get("/api/volunteers/me", headers=headers)
        volunteer_data = vol_res.json().get("data")
    except Exception:
        pass

    org_data = None
    try:
        org_res = await backend_client.get("/api/organizations/me", headers=headers)
        org_data = org_res.json().get("data")
    except Exception:
        pass

    onboarding_state = compute_onboarding_state(user_data, volunteer_data, org_data)

    return UnifiedSessionDTO(
        authenticated=True,
        user=user_data,
        volunteer=volunteer_data,
        organization=org_data,
        onboardingState=onboarding_state,
        permissions={}
    )


@router.get("/me")
async def get_session(request: Request, headers: dict = Depends(get_auth_headers)):
    session = await _build_session(headers)
    envelope = success_envelope(session.model_dump())
    return inject_request_id(envelope, request)
