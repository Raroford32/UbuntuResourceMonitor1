from flask import Flask, render_template, Response
from config import Config
from system_metrics import get_system_metrics
import json

app = Flask(__name__)
app.config.from_object(Config)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/metrics')
def metrics():
    def generate():
        while True:
            metrics = get_system_metrics()
            yield f"data: {json.dumps(metrics)}\n\n"

    return Response(generate(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2465)
