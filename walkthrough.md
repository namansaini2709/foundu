# Walkthrough - WhatsApp-First Onboarding & Semantic Matcher

The onboarding and recommendation pipeline has been upgraded to a **WhatsApp-First model** backed by **Postgres (Neon DB)**. New users can join the WhatsApp community, create profiles directly via interactive chats, and receive top-matching jobs/talent alerts automatically on their phones.

---

## ⚙️ Changes & Architecture Built

### 1. Database Schema (`whatsapp_onboarding_sessions`)
* Added automatic PostgreSQL table validation at server startup in [server.js](file:///c:/Users/Naman Saini/OneDrive/Desktop/foundu/foundu/backend/server.js).
* This creates the `whatsapp_onboarding_sessions` table in Neon DB which tracks:
  * `phone_number`
  * `role` ('freelancer', 'cofounder', 'founder')
  * `current_step`
  * `collected_data` (JSONB)

### 2. WhatsApp Webhook & Verification Route
* Exposed webhook endpoints in [whatsappRoutes.js](file:///c:/Users/Naman Saini/OneDrive/Desktop/foundu/foundu/backend/routes/whatsappRoutes.js):
  * `GET /api/whatsapp/webhook` - Validates the verification token with Meta.
  * `POST /api/whatsapp/webhook` - Parses incoming texts, quick replies, and attachments.
* Added corresponding controller handlers `verifyWebhook` and `handleIncomingMessage` in [whatsappController.js](file:///c:/Users/Naman Saini/OneDrive/Desktop/foundu/foundu/backend/controllers/whatsappController.js).

### 3. Dynamic Onboarding Workflow Engine
* Created [whatsappOnboardingService.js](file:///c:/Users/Naman Saini/OneDrive/Desktop/foundu/foundu/backend/services/whatsappOnboardingService.js) to manage the onboarding steps:
  * **Role Selection**: Asks users to reply with 1 (Freelancer), 2 (Co-founder), or 3 (Founder).
  * **Dynamic Questions**: Prompts users sequentially for details, mapped to the exact requirements requested:
    * **Freelancer**: Name, Email, Portfolio/GitHub, Core Skills, Preferred Tech Stack, Domain Expertise, Experience, Expected Budget, Resume (upload or paste text).
    * **Co-founder**: Name, Email, Area of Expertise, Preferred Startup Stage, Expected Equity, Background/Superpowers.
    * **Founder**: Name, Email, Startup Name, Idea Description, Immediate Hiring Needs, Hiring Budget.
  * **Database Registration**: Generates clean sequential IDs (`freelancer_id`, `founder_id`, `cofounder_id`), creates the user record in `users` (with dummy password credentials), and populates role-specific details (`freelancer_profiles`, `startup_profiles`, `cofounder_profiles`).
  * **Cleans Session**: Automatically purges state data on completion.

### 4. Semantic Recommendations Alerting & Multi-Category Search
* Added matching functions inside [geminiService.js](file:///c:/Users/Naman Saini/OneDrive/Desktop/foundu/foundu/backend/services/geminiService.js):
  * `getSemanticJobRecommendations`: Scores and recommends jobs to freelancers based on skills/experience/budget.
  * `getSemanticStartupRecommendations`: Ranks and matches co-founders to startups.
  * `getSemanticTalentRecommendations`: Suggests multi-category matching candidates to founders.
* **Founder Search Upgrades**: Upgraded `localSearchFreelancers` tool call to pass the founder's specific startup profile context (Startup Name, Idea, Hiring Needs, Budget) to Gemini. Gemini performs semantic, multi-category matches (e.g. 1 developer, 1 designer, 1 co-founder) returning match percentages and custom suitability explanations for every recommended candidate.
* Automatically sends the formatted recommendation list (with direct application links) to the user's phone on onboarding completion.

---

## 🔍 How to Test WhatsApp Onboarding

### 1. Configure webhook token in `.env`
Add your verification token to `backend/.env`:
```env
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
```

### 2. Run ngrok tunnel
Expose your local Express server (running on port `4000`) to the public internet:
```bash
ngrok http 4000
```
Copy the secure URL (e.g. `https://1234.ngrok-free.app`).

### 3. Configure webhook in Meta Developer Dashboard
* Go to your App page -> WhatsApp -> Configuration.
* Set **Callback URL** to `https://1234.ngrok-free.app/api/whatsapp/webhook`.
* Set **Verify Token** to your configured `WHATSAPP_VERIFY_TOKEN`.
* Subscribe to `messages` events.

### 4. Initiate onboarding chat
* Send a WhatsApp message (e.g. *"Hi"*) from your phone to the Meta test number.
* Ginnie will respond with the role selection menu. Follow the prompt to complete onboarding!
