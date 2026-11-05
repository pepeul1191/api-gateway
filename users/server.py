from flask import Flask, jsonify

app = Flask(__name__)

@app.after_request
def add_wappalyzer_headers(response):
    response.headers["X-Powered-By"] = "Flask"
    return response

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({"service": "Flask Users API", "users": ["Ana", "Carlos", "Pepe"]})

if __name__ == '__main__':
    app.run(port=3001)