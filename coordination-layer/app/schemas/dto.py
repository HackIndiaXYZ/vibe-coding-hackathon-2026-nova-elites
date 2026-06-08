from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class OnboardingStateDTO(BaseModel):
    state: str
    completionPercentage: int
    missingFields: List[str]

class UnifiedSessionDTO(BaseModel):
    authenticated: bool
    user: Optional[Dict[str, Any]] = None
    organization: Optional[Dict[str, Any]] = None
    volunteer: Optional[Dict[str, Any]] = None
    onboardingState: Optional[OnboardingStateDTO] = None
    permissions: Optional[Dict[str, Any]] = None

class DashboardBootstrapDTO(BaseModel):
    session: UnifiedSessionDTO
    organization: Optional[Dict[str, Any]] = None
    volunteer: Optional[Dict[str, Any]] = None
    notifications: Dict[str, Any] = {}
    readiness: Dict[str, Any] = {}
