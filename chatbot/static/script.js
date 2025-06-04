const chatboxBody = document.getElementById("chatboxBody");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const faqContainer = document.getElementById("faq-container"); // Get the FAQ container

// --- Chat Message Management ---

/**
 * Appends a new message to the chatbox.
 * @param {string} sender - 'user' or 'bot'.
 * @param {string} text - The message text.
 */
function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", sender === "bot" ? "bot-message" : "user-message");
  messageDiv.innerHTML = `<p>${text}</p>`;
  chatboxBody.appendChild(messageDiv);
  chatboxBody.scrollTop = chatboxBody.scrollHeight; // Scroll to the bottom
}

/**
 * Updates the text of the last bot message. Useful for "Thinking..." messages.
 * @param {string} text - The new message text.
 */
function updateLastBotMessage(text) {
  const messages = chatboxBody.querySelectorAll(".bot-message");
  const lastBot = messages[messages.length - 1];
  if (lastBot) {
    lastBot.innerHTML = `<p>${text}</p>`;
    chatboxBody.scrollTop = chatboxBody.scrollHeight; // Scroll to the bottom after update
  }
}

// --- Send Message Logic ---

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

/**
 * Handles sending a user message and getting a bot response.
 */
async function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  appendMessage("user", message);
  userInput.value = ""; // Clear input field

  // Ensure the 'askQuestion' tab is active and chat messages are visible
  // This handles cases where user might type in chat while on another tab
  const askQuestionTab = document.getElementById('askQuestion');
  const askQuestionButton = document.querySelector('.tab-button[data-tab="askQuestion"]');

  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

  askQuestionTab.classList.add('active');
  askQuestionButton.classList.add('active');

  appendMessage("bot", "Thinking..."); // Show thinking message

  try {
    const result = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await result.json();
    const reply = data.reply || "Something went wrong. Please try again.";
    updateLastBotMessage(reply);

  } catch (err) {
    updateLastBotMessage("Error talking to server.");
    console.error("Error sending message:", err);
  }
}


// --- FAQ Functionality ---

/**
 * Attaches click event listeners to FAQ questions to toggle their answers.
 * This function should be called after FAQs are loaded into the DOM.
 */
function attachFaqToggleListeners() {
  document.querySelectorAll('.faq-question').forEach(questionDiv => {
    questionDiv.addEventListener('click', () => {
      const answerDiv = questionDiv.nextElementSibling; // The answer is the next sibling
      const toggleIcon = questionDiv.querySelector('.toggle-icon');

      // Toggle the 'active' class on the answer
      answerDiv.classList.toggle('active');
      // Toggle the 'active' class on the question to rotate the icon
      questionDiv.classList.toggle('active');

      // Update the toggle icon text
      if (answerDiv.classList.contains('active')) {
        toggleIcon.textContent = '-';
      } else {
        toggleIcon.textContent = '+';
      }
    });
  });
}

/**
 * Fetches FAQ data from the backend and displays them in the FAQ container.
 * This function is called when the FAQ tab is clicked.
 */
async function fetchAndDisplayFAQs() {
  if (!faqContainer) {
    console.error("FAQ container not found!");
    return;
  }

  faqContainer.innerHTML = '<p>Loading FAQs...</p>'; // Show loading message

  try {
    const response = await fetch('/api/faqs'); // This endpoint will be created in Flask
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const faqs = await response.json();

    if (faqs.length === 0) {
      faqContainer.innerHTML = '<p>No FAQs available at the moment. Please check back later!</p>';
      return;
    }

    faqContainer.innerHTML = ''; // Clear loading message

    faqs.forEach(faq => {
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item');
      faqItem.innerHTML = `
        <div class="faq-question">
          <h3>${faq.question} <span class="toggle-icon">+</span></h3>
        </div>
        <div class="faq-answer">
          <p>${faq.answer}</p>
        </div>
      `;
      faqContainer.appendChild(faqItem);
    });

    // Attach toggle listeners to the newly added FAQ items
    attachFaqToggleListeners();

  } catch (error) {
    console.error('Error fetching and displaying FAQs:', error);
    faqContainer.innerHTML = '<p>Failed to load FAQs. Please try again later.</p>';
  }
}

// The initial tab switching logic is now primarily in index.html,
// ensuring it runs immediately. This script will handle the dynamic content
// and event listeners for the chat and FAQ sections.

// Initial call to fetch FAQs if the FAQ tab is the default active tab on load,
// or when the FAQ tab is clicked (handled in index.html's inline script).
// This ensures FAQs are loaded when the user navigates to the tab.
