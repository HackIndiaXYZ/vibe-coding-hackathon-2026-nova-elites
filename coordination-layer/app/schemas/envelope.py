"""
Frozen API Envelope — DO NOT MODIFY SHAPE

All frontend-facing responses MUST follow:
  { success: bool, data: T | null, meta: dict, errors: list[ErrorEntry] }

This is a platform guarantee once frontend ships.
"""

from pydantic import BaseModel
from typing import TypeVar, Generic, List, Optional, Dict, Any
from fastapi import Request

T = TypeVar("T")


class ErrorEntry(BaseModel):
    code: str
    message: str


class SuccessEnvelope(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None  # type: ignore[assignment]
    meta: Dict[str, Any] = {}
    errors: List[ErrorEntry] = []


class ErrorEnvelope(BaseModel):
    success: bool = False
    data: None = None
    meta: Dict[str, Any] = {}
    errors: List[ErrorEntry]


def success_envelope(data: Any, meta: Optional[Dict[str, Any]] = None) -> dict:
    """Build a frozen success envelope dict."""
    return {
        "success": True,
        "data": data,
        "meta": meta or {},
        "errors": [],
    }


def error_envelope(
    code: str = "UNKNOWN_ERROR",
    message: str = "Unexpected error",
    meta: Optional[Dict[str, Any]] = None,
) -> dict:
    """Build a frozen error envelope dict."""
    return {
        "success": False,
        "data": None,
        "meta": meta or {},
        "errors": [{"code": code, "message": message}],
    }


def inject_request_id(envelope: dict, request: Request) -> dict:
    """Inject requestId into meta from the middleware-set request state."""
    request_id = getattr(request.state, "request_id", None)
    if request_id:
        envelope.setdefault("meta", {})["requestId"] = request_id
    return envelope
