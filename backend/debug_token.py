import sys
sys.path.insert(0, ".")
from app.config import settings
from app.core.security import create_access_token, decode_token

# Test với sub là STRING (fix)
token = create_access_token({"sub": str(1), "role": "admin"})
payload = decode_token(token)
print("Decode result:", payload)
print("sub type:", type(payload.get("sub")) if payload else "N/A")
