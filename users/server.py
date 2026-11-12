from flask import Flask, jsonify

app = Flask(__name__)

def api_response(success, message, data=None, error=None, status_code=200):
    response = {
        "success": success,
        "message": message,
        "data": data,
        "error": error
    }
    return jsonify(response), status_code

@app.after_request
def add_wappalyzer_headers(response):
    response.headers["X-Powered-By"] = "Flask"
    return response

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = [{"id": 1, "name": "José"}, {"id": 2, "name": "Sila"}] # Simulación de DB
        return api_response(
            success=True,
            message="Usuarios obtenidos correctamente",
            data=users,
            error=None
        )
    except Exception as e:
        return api_response(
            success=False,
            message="Error al procesar la petición",
            data=None,
            error=str(e),
            status_code=500
        )

if __name__ == '__main__':
    app.run(port=3001)