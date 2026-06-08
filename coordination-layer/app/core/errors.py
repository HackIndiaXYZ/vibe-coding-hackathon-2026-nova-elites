from fastapi import Request
from fastapi.responses import JSONResponse
from app.schemas.envelope import error_envelope
import httpx
import logging

logger = logging.getLogger(__name__)


async def backend_exception_handler(request: Request, exc: httpx.HTTPStatusError):
    """
    Translates backend errors into the frozen frontend-safe envelope.

    Frontend MUST always receive:
      { success: false, data: null, meta: { requestId }, errors: [{ code, message }] }

    Even for unknown/unhandled failures.
    """
    request_id = getattr(request.state, "request_id", None)
    meta = {"requestId": request_id} if request_id else {}

    try:
        data = exc.response.json()
        # If backend already returns frozen envelope, forward it with requestId
        if "errors" in data and isinstance(data["errors"], list):
            data.setdefault("meta", {}).update(meta)
            return JSONResponse(status_code=exc.response.status_code, content=data)

        # Legacy backend format: { error: { message, code } }
        if "error" in data and isinstance(data["error"], dict):
            err = data["error"]
            envelope = error_envelope(
                code=err.get("code", "UNKNOWN_ERROR"),
                message=err.get("message", "Unexpected error"),
                meta=meta,
            )
            return JSONResponse(status_code=exc.response.status_code, content=envelope)

        # Unrecognized payload — wrap generically
        envelope = error_envelope(
            code="UNKNOWN_ERROR",
            message=str(data),
            meta=meta,
        )
        return JSONResponse(status_code=exc.response.status_code, content=envelope)

    except Exception:
        logger.exception("Failed to parse backend error response")
        envelope = error_envelope(
            code="UNKNOWN_ERROR",
            message="Unexpected error",
            meta=meta,
        )
        return JSONResponse(status_code=502, content=envelope)


async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catch-all handler for unhandled exceptions.

    Guarantees the frozen envelope shape even for completely unexpected failures.
    Frontend should NEVER receive raw stack traces, HTML errors, or unwrapped exceptions.
    """
    logger.exception("Unhandled exception in coordination layer")
    request_id = getattr(request.state, "request_id", None)
    meta = {"requestId": request_id} if request_id else {}
    
    envelope = error_envelope(
        code="UNKNOWN_ERROR",
        message="Unexpected error",
        meta=meta,
    )
    return JSONResponse(status_code=500, content=envelope)
