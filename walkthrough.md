# 📖 WhatsApp-First Onboarding & Matchmaker Testing Guide

This guide is designed for **beginners and testers** to walk through and verify the WhatsApp-First Onboarding & Semantic Matchmaking features. It contains two testing methods:
*   **Method A: Mock Local Simulation** (Quickest, runs locally in seconds, no configuration or accounts needed).
*   **Method B: Real WhatsApp Meta Cloud API Integration** (End-to-end testing with a real phone and WhatsApp messages).

---

## 🚀 What is WhatsApp-First Onboarding?
Instead of forcing users to visit the website and fill out lengthy forms, FoundU automates onboarding directly through a conversational chat on WhatsApp.
1.  **Welcome & Role Selection**: The user sends any message to start. The AI welcomes them and asks them to reply with a number to select their role:
    *   `1` for **Freelancer**
    *   `2` for **Co-Founder**
    *   `3` for **Founder**
2.  **Conversational Data Collection**: The AI dynamically asks sequential questions based on the role.
3.  **Automatic DB Creation**: When complete, the backend registers a new user in the PostgreSQL database and populates their profile.
4.  **Semantic Match Alerts**: The AI immediately compares the new profile against active opportunities and sends the top 3 matches with match scores and suitabilities directly to the user's WhatsApp chat with direct web links!

---

## 🖥️ Method A: Quick Mock Local Simulation
This method simulates WhatsApp messages by hitting the backend webhook locally. You do **not** need a Meta developer account or a Twilio/WhatsApp setup.

### Step 1: Install dependencies and prepare environment
1.  Open your terminal, navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
2.  Install packages (if not already installed):
    ```bash
    npm install
    ```
3.  Ensure your `backend/.env` has a valid `GEMINI_API_KEY` and `DATABASE_URL` (connected to Neon PostgreSQL).

### Step 2: Start the backend server
1.  In your terminal, start the server:
    ```bash
    node server.js
    ```
2.  Verify in the console that it says:
    *   `🚀 FoundU backend running on 4000`
    *   `[DB Init] whatsapp_onboarding_sessions table verified.`
    *   `[DB Init] Column "embedding" verified...`

### Step 3: Run the simulation script
1.  Open a **second terminal window** (do not close the server terminal).
2.  Navigate to the `backend/` directory:
    ```bash
    cd backend
    ```
3.  Run the simulation script:
    ```bash
    node scripts/simulate_whatsapp_onboarding.js
    ```
4.  **What to look for**:
    *   The script sends mock incoming messages imitating a user chatting with the webhook.
    *   You will see console logs printing each step:
        *   Selecting role `1` (Freelancer).
        *   Answering Name, Email, Skills, Tech Stack, Budget, and pasting Resume text.
        *   On the final step, the simulation triggers the semantic matchmaker and prints the matched job postings returned by the AI.
    *   Example success output:
        ```text
        [Sent text]: "1" (Selecting Freelancer)
        [Sent text]: "Jane Freelancer"
        [Sent text]: "React, Node.js, Stripe, PostgreSQL"
        ...
        🎉 Onboarding Simulation Completed successfully!
        Check the database users and freelancer_profiles tables for user 'jane.free@example.com'!
        ```

### Step 4: Verify PostgreSQL Database entries
Connect to your database (using a client like DBeaver or a command script) and check:
*   `SELECT * FROM users WHERE email = 'jane.free@example.com';` (Should return the newly created user).
*   `SELECT * FROM freelancer_profiles WHERE email = 'jane.free@example.com';` (Should contain the skills, experience, budget, and generated vector embeddings).

---

## 📱 Method B: Real Device Testing (Meta Cloud API Integration)
This method connects a real WhatsApp phone number to the local backend using Meta's Cloud API and ngrok.

### Step 1: Download and Start ngrok
Since WhatsApp webhooks require a secure public HTTPS URL, we use ngrok to tunnel traffic to our local port `4000`.
1.  Download ngrok from [ngrok.com](https://ngrok.com) and install it.
2.  Open your terminal and run:
    ```bash
    ngrok http 4000
    ```
3.  Copy the secure **Forwarding URL** (e.g. `https://1234-abcd-5678.ngrok-free.app`). Keep this terminal open!

### Step 2: Configure Meta Developer Portal
1.  Log in to the [Meta Developer Dashboard](https://developers.facebook.com/).
2.  Select your App -> Go to **WhatsApp** -> click **Configuration**.
3.  Under **Webhook**, click **Edit**:
    *   **Callback URL**: Paste your ngrok forwarding URL and append `/api/whatsapp/webhook` (e.g. `https://1234-abcd-5678.ngrok-free.app/api/whatsapp/webhook`).
    *   **Verify Token**: Enter a secret verify token (e.g. `foundu_verify_secret_123`).
    *   Click **Verify and Save**.
4.  Click **Manage Webhook Fields** -> find **`messages`** -> click **Subscribe** -> click **Done**.

### Step 3: Update backend `.env` variables
Open your `backend/.env` file and set/verify:
```env
PORT=4000
WHATSAPP_VERIFY_TOKEN=foundu_verify_secret_123   # Must match Verify Token in Meta
META_ACCESS_TOKEN=your_meta_system_access_token # Temporary or permanent access token
META_PHONE_NUMBER_ID=your_test_phone_id         # E.g. 1016957698174943
```

### Step 4: Run the Backend server
Start the server in the `backend/` folder:
```bash
node server.js
```

### Step 5: Send a WhatsApp message from a phone
1.  Get the WhatsApp test phone number assigned to your WhatsApp Business Account (found on the Meta WhatsApp Getting Started screen).
2.  Add that number to your phone contacts.
3.  Open WhatsApp on your phone and send a message like: **`Hi`**
4.  **Observe the response**:
    *   The test number should instantly welcome you and ask you to reply with `1`, `2`, or `3` to choose your role.
5.  Follow the conversation on your phone:
    *   Reply `1`
    *   Send your name, email, portfolio link, skills, experience, etc.
    *   Upload or paste a summary of your resume.
6.  On completion:
    *   The backend registers you in the database.
    *   You will receive a WhatsApp message from Ginnie listing the top 3 best matching jobs/candidates, along with match percentages, explanations, and clickable links to view and apply on the web dashboard!

---

## 🛠️ Local Similarity Engine & Postgres Vector Matching (Completed Upgrades)

We have successfully migrated the AI Matchmaking and Chat tools from Pinecone to an **in-database PostgreSQL JSONB + local JS Cosine Similarity Engine**. 

### 1. Vector Database Migration (Pinecone ➡️ PostgreSQL JSONB)
* **Schema Alterations:** Added native `JSONB` `embedding` columns to `freelancer_profiles`, `cofounder_profiles`, `startup_profiles`, and `foundu_jobs` tables.
* **Auto-Backfill on Server Startup:** The server dynamically checks for profiles/jobs missing embeddings on startup, generates vectors via Gemini `gemini-embedding-2`, and updates the database automatically in the background (fully hands-off for developers).
* **JavaScript Cosine Similarity Engine:** Built a pure JS similarity calculation module inside `geminiService.js` that selects candidates locally, dramatically reducing latency and platform fees.

### 2. FounderGPT Tool Calling & Integrations
* **Dynamic Tool Calling:** The `/founder-ai` page now uses `nonStreamChatCompletion` which allows Ginnie to trigger functional tools dynamically:
  * **validate_startup_idea:** Generates a structured venture analysis report containing TAM/SAM/SOM, roadmaps, competitors, and software vendor resources.
  * **search_freelancers:** Runs the vector similarity engine on Postgres to recommend matching candidates directly inside the chat window.
* **Typing Focus Fix:** Refactored the `Composer` text area component in the frontend (`FounderAI.jsx`) to resolve the character loss glitch so typing is completely smooth.

### 3. Critical Postgres Type Mismatch Resolves
* **Signup 500 error fixed:** Replaced boolean insert values (`false` -> `0`) for the `is_profile_complete` column to comply with PostgreSQL's strict typing rules for `smallint` columns.
* **Chat 500 unread count error fixed:** Corrected boolean checks (`is_seen = false` -> `is_seen = 0`) inside `chatController.js` to ensure the unread count queries execute without operator type conflicts.

