# 🤖 Digi-Buddy Chatbot

**Digi-Buddy** is a smart AI-powered chatbot designed to assist users with general queries and digital tasks. It’s built using **HTML, CSS, and JavaScript** for the frontend and powered by a **Python Flask** backend integrated with **Google Gemini AI** for generating intelligent responses.

---

## 🌐 Features

- Simple and user-friendly chat interface.
- Asynchronous communication using JavaScript and Fetch API.
- Backend powered by Flask for API handling.
- Gemini AI integration for smart and dynamic chatbot responses.
- Easily customizable for different domains (education, customer support, etc.)

---

## 🛠️ Tech Stack

| Layer       | Technology               |
|-------------|---------------------------|
| Frontend    | HTML, CSS, JavaScript     |
| Backend     | Python, Flask             |
| AI Engine   | Google Gemini API         |

---

## 📁 Project Structure

digi-buddy/
├── app/                        # Main application package
│   ├── __init__.py             # Initializes the Flask app
│   ├── routes.py               # Flask routes and API endpoints
│   ├── gemini_api.py           # Handles Gemini AI requests
│
├── static/                     # Frontend static files
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   ├── js/
│   │   └── script.js           # Chat functionality
│   └── assets/                 # (Optional) Images, icons, etc.
│
├── templates/                  # HTML templates
│   └── index.html              # Main chatbot interface
│
├── .env                        # Environment variables (Gemini API key, etc.)
├── app.py                      # App entry point (runs the Flask server)
├── requirements.txt            # Python dependencies
├── README.md                   # Project documentation
└── LICENSE                     # Project license (optional)


 ## Install Required Packages

 - pip install -r requirements.txt


 
