from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import google.generativeai as genai # Import the Gemini library

# Optional: load environment variables from .env file
# Make sure to install python-dotenv if you use this (pip install python-dotenv)
# from dotenv import load_dotenv
# load_dotenv()

# Initialize Flask app, specifying default template and static folders
# Flask will now look for HTML files in 'templates/' and static files in 'static/'
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Configure your Gemini API key
# Recommended: Use environment variable
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Direct assignment (only for testing — NOT SAFE FOR PRODUCTION)
# Replace "YOUR_GEMINI_API_KEY" with your actual Gemini API key
genai.configure(api_key="your_api") # Using your provided key, but replace for actual deployment!

# Initialize the Gemini model
# You can choose a different model if desired, e.g., "models/gemini-1.5-pro"
# Ensure the model name you choose supports 'generateContent'
model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

# --- FAQ Data ---
# This is your FAQ knowledge base. You can expand this with more questions and answers.
# In a more complex application, this data might come from a database.
faq_data = [
    {"question": "What is DigiLocker?", "answer": "DigiLocker is a digital locker system by the Government of India for secure storage and access to digital documents. It allows citizens to store digital copies of their documents like Aadhaar, driving license, and vehicle registration."},
    {"question": "How do I sign up for DigiLocker?", "answer": "You can sign up for DigiLocker using your Aadhaar number and a registered mobile number. Visit the official DigiLocker website or download the mobile app to get started."},
    {"question": "Is DigiLocker secure?", "answer": "Yes, DigiLocker uses various security measures, including 256-bit SSL encryption, Aadhaar-based authentication, and a robust security infrastructure, to ensure the safety and privacy of your documents."},
    {"question": "How can I upload documents to DigiLocker?", "answer": "You can upload documents by logging into your DigiLocker account, navigating to the 'Uploaded Documents' section, and using the upload option. Ensure the documents are in supported formats like PDF, JPEG, or PNG."},
    {"question": "What documents can I store in DigiLocker?", "answer": "You can store a wide range of documents including Aadhaar card, PAN card, driving license, vehicle registration certificate, educational certificates, and many other government-issued documents."},
    {"question": "How to reset my password?", "answer": "To reset your DigiLocker password, go to the login page, click on 'Forgot Password', and follow the instructions to reset it using your Aadhaar or mobile number."},
    {"question": "How to report a bug?", "answer": "If you encounter a bug, please visit the 'Get Help' or 'Troubleshooting' sections for common solutions, or contact DigiLocker support directly via their official channels."},
    {"question": "Can I share documents from DigiLocker?", "answer": "Yes, DigiLocker allows you to securely share your digital documents with various entities, including government departments and other organizations, directly from the platform."}
]


@app.route("/")
def home():
    # Flask will now automatically look for 'index.html' inside the 'templates' folder
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    try:
        # Use Gemini's generate_content method
        response = model.generate_content(user_message)
        reply = response.text # Access the generated text

        return jsonify({"reply": reply})
    except Exception as e:
        print("Error during Gemini API call:", e)  # Debug message
        # Provide a more user-friendly error message if desired
        return jsonify({"error": "Failed to get a response from the AI. Please try again later. (Error: {})".format(str(e))}), 500

@app.route("/api/faqs", methods=["GET"])
def get_faqs():
    """
    API endpoint to serve FAQ data.
    Returns a JSON array of FAQ objects.
    """
    return jsonify(faq_data)

if __name__ == "__main__":
    app.run(debug=True)
