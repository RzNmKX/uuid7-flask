from flask import Flask, render_template, jsonify, abort
# from uuid_extensions import uuid7, uuid7str, uuid_to_datetime
from werkzeug.middleware.proxy_fix import ProxyFix
import re
from uuid7 import uuid7, uuid7str, uuid_to_datetime

UUIDv7_PATTERN = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', re.IGNORECASE)

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/generate')
def generate_uuid():
    return jsonify({"uuid": uuid7str()})

@app.route('/api/validate/<uuid>')
def validate_uuid(uuid):
    # Check if UUID length is within expected bounds
    if len(uuid) > 36:  # assuming UUID v7 is not longer than 36 characters
        abort(400, description="Invalid UUID length")

    # Check UUID format using regex
    if not UUIDv7_PATTERN.match(uuid):
        abort(400, description="Invalid UUIDv7 format")

    try:
        uuid_timestamp = uuid_to_datetime(uuid)
        if uuid_timestamp is None:
            return jsonify({"valid": False})
        else:
            return jsonify({"valid": True, "timestamp": uuid_timestamp})
    except ValueError:
        return jsonify({"valid": False})

    # Handle unexpected exceptions (optional based on your application's need)
    except Exception as e:
        # Log the exception for internal review
        # Return a generic error message to the client
        return jsonify({"error": "An unexpected error occurred"})


if __name__ == '__main__':
    # listen on all IPs
    app.run(host='0.0.0.0', port=5602, debug=False)