from fastapi import Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_auth_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """Extracts the JWT token from the Authorization header."""
    return credentials.credentials

def get_auth_headers(token: str = Security(get_auth_token)) -> dict:
    """Returns headers suitable for passing to backend services."""
    return {"Authorization": f"Bearer {token}"}
