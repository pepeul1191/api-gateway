import os
import jwt
from flask import Flask, jsonify, request

app = Flask(__name__)

# Misma clave secreta configurada en el microservicio de Auth
JWT_SECRET = os.getenv("JWT_SECRET", "mi_clave_secreta_super_segura")


def api_response(success, message, data=None, error=None, status_code=200):
    response = {
        "success": success,
        "message": message,
        "data": data,
        "error": error,
    }
    return jsonify(response), status_code


def extract_jwt_token():
    auth_header = request.headers.get("Authorization", "")
    parts = auth_header.split(" ", 1)
    if len(parts) == 2 and parts[0].lower() == "bearer" and parts[1].strip():
        return parts[1].strip()
    return None


def decode_jwt(token):
    if not token:
        return None
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_sub": False},
        )
    except jwt.PyJWTError as e:
        print(f"[FLASK JWT ERROR] {e}", flush=True)
        return None


@app.after_request
def add_wappalyzer_headers(response):
    response.headers["X-Powered-By"] = "Flask"
    return response


@app.route("/api/users", methods=["GET"])
def get_users():
    try:
        token = extract_jwt_token()
        payload = decode_jwt(token)

        print(f"[FLASK JWT TOKEN] {token}", flush=True)
        print(f"[FLASK JWT PAYLOAD] {payload}", flush=True)

        current_user = None
        if payload:
            current_user = {
                "id": payload.get("sub"),
                "username": payload.get("username"),
                "role": payload.get("role"),
            }

        users = [
            {"id": 1, "name": "José"},
            {"id": 2, "name": "Sila"},
        ]

        return api_response(
            success=True,
            message="Usuarios obtenidos correctamente",
            data={
                "service": "Flask Users API",
                "authenticated_user": current_user,
                "users": users,
            },
            error=None,
        )
    except Exception as e:
        print(f"[FLASK ERROR] {e}", flush=True)
        return api_response(
            success=False,
            message="Error al procesar la petición",
            data=None,
            error=str(e),
            status_code=500,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 3001))
    app.run(host="0.0.0.0", port=port)