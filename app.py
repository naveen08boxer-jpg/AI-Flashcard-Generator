from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import openai
import os
import json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate_flashcards():
    data = request.json
    topic = data.get("topic")

    prompt = f"""
    Generate exactly 5 educational flashcards on the topic "{topic}".
    Return only JSON in this format:
    [
      {{"question": "...", "answer": "..."}},
      {{"question": "...", "answer": "..."}}
    ]
    """

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an educational assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    flashcards = json.loads(response.choices[0].message.content)
    return jsonify(flashcards)

if __name__ == "__main__":
    app.run(debug=True)