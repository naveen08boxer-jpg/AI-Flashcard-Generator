from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "AI Flashcard Generator API is running"

@app.route("/generate", methods=["POST"])
def generate_flashcards():
    data = request.get_json()
    topic = data.get("topic", "AI")

    flashcards = [
        {"question": f"What is {topic}?", "answer": f"{topic} is an important concept in computer science."},
        {"question": f"Why is {topic} used?", "answer": f"{topic} is used to solve real-world problems efficiently."},
        {"question": f"Advantages of {topic}?", "answer": f"{topic} improves performance and scalability."},
        {"question": f"Applications of {topic}?", "answer": f"{topic} is used in education, healthcare, and industry."},
        {"question": f"Future scope of {topic}?", "answer": f"{topic} has a strong future with growing demand."}
    ]

    return jsonify(flashcards)