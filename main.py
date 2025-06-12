import os
import json
from flask import Flask, request
from google.cloud import pubsub_v1

app = Flask(__name__)
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(os.environ["GCP_PROJECT"], "upload-topic")

@app.route("/", methods=["POST"])
def index():
    envelope = request.get_json()
    file_data = envelope.get("data", {})

    name = file_data.get("name", "unknown")
    size = file_data.get("size", 0)
    extension = name.split(".")[-1] if "." in name else "unknown"

    message = {
        "name": name,
        "size": size,
        "format": extension
    }

    publisher.publish(topic_path, json.dumps(message).encode("utf-8"))
    return "Message published", 200
