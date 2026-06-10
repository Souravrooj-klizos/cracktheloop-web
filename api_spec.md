# 🧠 CrackTheLoop — Backend API Specifications

This document defines the backend REST API endpoints, request schemas, validations, query parameters, headers, and responses for the **Resume/CV Management**, **Call Sessions (Standard/Free)**, and **AI Completion & Coach Assistance** services.

---

## 🔗 Base URL
All API paths listed in this document are relative to the server host:
* **Development**: `http://localhost:3000`
* **Production**: `https://api.cracktheloop.com` (or your configured production domain)

---

## 🔑 Authentication & Headers
All private API requests require standard Bearer token authentication.

### **Required Headers**
```http
Authorization: Bearer <your_session_jwt_token>
Content-Type: application/json
```
*Note: For the multi-part upload endpoint, the browser or HTTP client will set the `Content-Type` automatically to `multipart/form-data` with boundaries. Do not manually specify `Content-Type` for uploads.*

---

## 📊 Endpoints Directory Summary

### 📂 Resume Management APIs
| Method | Endpoint | Auth | Description |
|:---|:---|:---:|:---|
| **POST** | `/api/resumes/upload` | Yes | Upload and auto-parse PDF/DOCX/TXT resumes |
| **GET** | `/api/resumes` | Yes | List resumes (supports search, sort, pagination) |
| **POST** | `/api/resumes` | Yes | Create a resume manually from JSON |
| **GET** | `/api/resumes/[id]` | Yes | Retrieve a specific resume configuration |
| **PUT** | `/api/resumes/[id]` | Yes | Save/Update structured details of a resume |
| **DELETE** | `/api/resumes/[id]` | Yes | Permanently delete a resume |

### 📞 Call Session Config APIs
| Method | Endpoint | Auth | Description |
|:---|:---|:---:|:---|
| **POST** | `/api/sessions` | Yes | Create a standard/paid call session config |
| **POST** | `/api/sessions/free` | Yes | Create a 10-minute free session config (12m cooldown) |
| **GET** | `/api/sessions` | Yes | List call sessions (supports status, search, pagination) |
| **GET** | `/api/sessions/[id]` | Yes | Retrieve details, transcript, and report of a session |
| **PUT** | `/api/sessions/[id]` | Yes | Modify config or save live transcripts |
| **PATCH** | `/api/sessions/[id]` | Yes | Alias of PUT for compatibility |
| **DELETE** | `/api/sessions/[id]` | Yes | Permanently delete a session configuration |

### 🤖 AI Copilot & Evaluation Summary APIs
| Method | Endpoint | Auth | Description |
|:---|:---|:---:|:---|
| **POST** | `/api/completion` | Yes | Live AI Copilot Guidance (Streams `text/event-stream`) |
| **POST** | `/api/sessions/[id]/summary` | Yes | Compile final evaluation report (Deducts 5 credits) |
| **POST** | `/api/sessions/[id]/chat` | Yes | AI Interview Coach follow-up chat (Streams SSE) |

---

## 📂 Section 1: Resume Management APIs

### 1. Upload & Auto-Parse Resume
Extracts raw text from documents, uses `gpt-4o-mini` to structure it, and saves the resume.

* **Endpoint**: `POST /api/resumes/upload`
* **Content-Type**: `multipart/form-data`
* **Request Payload**:
  * `file`: Binary File (**Required**) — Allowed formats: `.pdf`, `.docx`, `.txt`
  * `title`: String (Optional) — Custom title/label for the resume. Defaults to `"My Resume"` or filename.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "resume": {
      "_id": "66687a38b1d9bf1b51e7fb5c",
      "user_id": "66687353b1d9bf1b51e7fb22",
      "title": "Senior React Developer Resume",
      "personal_details": {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "+91 98765 43210",
        "location": "Kolkata, India"
      },
      "summary": "Frontend developer specializing in high-performance web applications and React architecture.",
      "education": [
        {
          "school": "Jadavpur University",
          "degree": "Bachelor of Technology",
          "field_of_study": "Computer Science",
          "start_date": "2018",
          "end_date": "2022",
          "description": "Graduated with honors. Specialization in Distributed Systems."
        }
      ],
      "experience": [
        {
          "company": "Kolkata Software Labs",
          "position": "Software Engineer (Frontend)",
          "location": "Kolkata, India",
          "start_date": "2022-07",
          "end_date": "Present",
          "description": "Designed and deployed responsive Next.js dashboards. Improved bundle size by 40%."
        }
      ],
      "skills": ["React", "Next.js", "TypeScript", "TailwindCSS", "Redux", "Webpack"],
      "projects": [
        {
          "title": "Collaborative IDE Portal",
          "description": "A cloud-based real-time code editor with operational transformation.",
          "technologies": ["React", "Socket.io", "Express", "MongoDB"]
        }
      ],
      "created_at": "2026-06-10T12:00:00.000Z",
      "updated_at": "2026-06-10T12:00:00.000Z"
    }
  }
  ```

---

### 2. List Resumes
Lists all resumes belonging to the authenticated user.

* **Endpoint**: `GET /api/resumes`
* **Query Parameters**:
  * `search`: String (Optional) — Matches text in resume `title`, `skills`, or `personal_details.name`.
  * `sort`: String (Optional) — Options:
    * `date_desc` (default) — Newest first
    * `date_asc` — Oldest first
    * `title_asc` — Alphabetical by title
    * `title_desc` — Reverse alphabetical by title
  * `page`: Number (Optional, default: `1`)
  * `limit`: Number (Optional, default: `10`)
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "resumes": [
      {
        "_id": "66687a38b1d9bf1b51e7fb5c",
        "user_id": "66687353b1d9bf1b51e7fb22",
        "title": "Senior React Developer Resume",
        "skills": ["React", "Next.js", "TypeScript"],
        "created_at": "2026-06-10T12:00:00.000Z",
        "updated_at": "2026-06-10T12:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

---

### 3. Create Resume Manually
Manually adds structured resume records.

* **Endpoint**: `POST /api/resumes`
* **Content-Type**: `application/json`
* **Request Payload**:
  * `title`: String (**Required**) — Title of the resume.
  * `personal_details`: Object (Optional)
    * `name`: String (Optional)
    * `email`: String (Optional)
    * `phone`: String (Optional)
    * `location`: String (Optional)
  * `summary`: String (Optional)
  * `education`: Array of Objects (Optional)
    * `school`: String (Optional)
    * `degree`: String (Optional)
    * `field_of_study`: String (Optional)
    * `start_date`: String (Optional)
    * `end_date`: String (Optional)
    * `description`: String (Optional)
  * `experience`: Array of Objects (Optional)
    * `company`: String (Optional)
    * `position`: String (Optional)
    * `location`: String (Optional)
    * `start_date`: String (Optional)
    * `end_date`: String (Optional)
    * `description`: String (Optional)
  * `skills`: Array of Strings (Optional)
  * `projects`: Array of Objects (Optional)
    * `title`: String (Optional)
    * `description`: String (Optional)
    * `technologies`: Array of Strings (Optional)
* **Success Response (`200 OK`)**: Returns the full saved `resume` document object with `success: true`.

---

### 4. Get Resume Details
Retrieves details of a specific resume.

* **Endpoint**: `GET /api/resumes/[id]`
* **URL Params**: `[id]` = MongoDB ObjectId string (e.g. `66687a38b1d9bf1b51e7fb5c`)
* **Success Response (`200 OK`)**: Returns the full parsed `resume` object with `success: true`.

---

### 5. Save/Update Resume
Updates fields or blocks of an existing resume.

* **Endpoint**: `PUT /api/resumes/[id]`
* **URL Params**: `[id]` = MongoDB ObjectId string
* **Request Payload**: (Provide only the fields you wish to modify. Example for adding skill and updating summary):
  ```json
  {
    "summary": "Updated summary focusing on system architecture.",
    "skills": ["React", "Next.js", "TypeScript", "Node.js", "Docker"]
  }
  ```
* **Success Response (`200 OK`)**: Returns the updated `resume` object with `success: true`.

---

### 6. Delete Resume
Removes the resume from the database.

* **Endpoint**: `DELETE /api/resumes/[id]`
* **URL Params**: `[id]` = MongoDB ObjectId string
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Resume deleted successfully"
  }
  ```

---

## 📞 Section 2: Call Sessions APIs

### 1. Create Paid/Standard Session Configuration
Creates a persistent session context. This does not have a creation cooldown.

* **Endpoint**: `POST /api/sessions`
* **Content-Type**: `application/json`
* **Request Payload**:
  * `role`: String (**Required**) — Targeted job title (e.g., `"Senior Backend Engineer"`)
  * `company`: String (Optional) — Name of the company interviewing for (default: `"General Interview Session"`)
  * `language`: String (Optional) — Language for guidance responses (default: `"english"`)
  * `behavior_tone`: String (Optional) — Tone model (default: `"professional"`)
  * `job_description`: String (Optional) — Job requirements/description text
  * `instructions`: String (Optional) — Custom extra AI guidelines
  * `ai_model`: String (Optional) — Model selection. Options: `"gpt-4o-mini"` (default), `"gpt-5.4-mini"`, `"llama-3.1-8b-instant"`
  * `resume_id`: String (Optional) — Mongoose ObjectId string of a linked Resume
  * `sessionId`: String (Optional) — Custom UUID. (Will be generated as standard UUID automatically if omitted)
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "session": {
      "_id": "66688049b1d9bf1b51e7fb7a",
      "user_id": "66687353b1d9bf1b51e7fb22",
      "role": "Senior Backend Engineer",
      "company": "Kolkata Tech Enterprise",
      "language": "english",
      "behavior_tone": "professional",
      "job_description": "We are seeking a node engineer...",
      "instructions": "Ensure explanations relate closely to database indexing.",
      "ai_model": "gpt-4o-mini",
      "resume_id": "66687a38b1d9bf1b51e7fb5c",
      "session_id": "e81d11ca-9b2f-41cc-8c10-21a4fdf2451f",
      "status": "created",
      "transcript": [],
      "report": null,
      "created_at": "2026-06-10T12:10:00.000Z",
      "updated_at": "2026-06-10T12:10:00.000Z"
    }
  }
  ```

---

### 2. Create Free Session Configuration
Creates a free mock interview session configuration.

* **Endpoint**: `POST /api/sessions/free`
* **Content-Type**: `application/json`
* **Request Payload**: (Identical to `POST /api/sessions`. Defaults company to `"Free Session (10 min)"`)
* **Validations & Limits**:
  * Enforces a **12-minute cooldown limit**. If the user has created another free session within the last 12 minutes, the request is rejected with `429 Too Many Requests`.
* **Success Response (`200 OK`)**: Returns the created session configuration JSON (similar structure to standard session creation).

---

### 3. List Call Sessions
Lists past and current call sessions belonging to the user.

* **Endpoint**: `GET /api/sessions`
* **Query Parameters**:
  * `search`: String (Optional) — Matches text in `role` or `company`.
  * `status`: String (Optional) — Filters by state: `"created"`, `"active"`, `"completed"`.
  * `sort`: String (Optional) — Options:
    * `date_desc` (default) — Newest first
    * `date_asc` — Oldest first
    * `role_asc` — Alphabetical order of target role
  * `page`: Number (Optional, default: `1`)
  * `limit`: Number (Optional, default: `10`)
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "sessions": [ ... ],
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
  ```

---

### 4. Get Call Session Details
Retrieves configuration, active transcript transcript logs, and AI report evaluation data for a session.

* **Endpoint**: `GET /api/sessions/[id]`
* **URL Params**: `[id]` = MongoDB ObjectId string OR the custom UUID `session_id` (the backend handles both lookups seamlessly)
* **Success Response (`200 OK`)**: Returns the full session object with populate `resume_id` and `success: true`.

---

### 5. Update Call Session
Updates configurations, session state, or logs transcript turns during call flows.

* **Endpoint**: `PUT /api/sessions/[id]` *(or `PATCH /api/sessions/[id]`)*
* **URL Params**: `[id]` = MongoDB ObjectId string OR UUID `session_id`
* **Request Payload**: (Provide fields to update. Example update during call setup/execution):
  ```json
  {
    "status": "active",
    "transcript": [
      {
        "sender": "interviewer",
        "text": "Tell me about a complex database query you optimized.",
        "timestamp": "2026-06-10T12:12:00.000Z"
      },
      {
        "sender": "candidate",
        "text": "In my previous project, we had an index page querying a composite field...",
        "timestamp": "2026-06-10T12:13:00.000Z"
      }
    ]
  }
  ```
* **Success Response (`200 OK`)**: Returns the updated `session` object.

---

### 6. Delete Call Session
Deletes a session config from the account.

* **Endpoint**: `DELETE /api/sessions/[id]`
* **URL Params**: `[id]` = MongoDB ObjectId OR UUID `session_id`
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Session deleted successfully"
  }
  ```

---

## 🤖 Section 3: AI Completion, Summary & Assistant APIs

### 1. Streaming AI Copilot Completion (Live Interview Guidance)
Streams real-time candidate answers. The endpoint handles session lookup, links candidate CV context, uses the configured model, and logs pricing usage.

* **Endpoint**: `POST /api/completion`
* **Content-Type**: `application/json`
* **Headers**: `Accept: text/event-stream`
* **Request Payload**:
  * `prompt`: String (**Required**) — The interviewer's query or screen-extracted coding problem text.
  * `token`: String (Optional) — JWT Token. If not provided in body, you MUST send it in the headers as `Authorization: Bearer <token>`.
  * `sessionId`: String (Optional) — Link session config. Strongly recommended so that resume, tone, language, and model constraints are fetched.
  * `role`: String (Optional) — Targeted job/interview position (fallback if `sessionId` is not provided).
  * `jobDescription`: String (Optional) — Job details or description text (fallback if `sessionId` is not provided).
  * `candidateResume`: String (Optional) — Plain text resume content (fallback if `sessionId` is not provided).
  * `provider`: String (Optional) — Overrides backend default provider. Options: `"openai"`, `"groq"`, `"xai"`, `"anthropic"`, `"gemini"`.
  * `apiKey`: String (Optional) — Client-provided API key (pass `"server"` or omit to use the server's configured keys).
  * `requestType`: String (Optional) — Options:
    * `"normal"` (default) — Standard question response.
    * `"regeneration"` — Triggers revised logic utilizing `previousAnswer`.
    * `"screen_capture"` — Optimizes prompts for analyzing raw OCR code challenges.
  * `previousAnswer`: String (Optional) — Relevant only when `requestType` is `"regeneration"`.
  * `history`: Array of Objects (Optional) — Conversation context turns:
    ```json
    [
      { "sender": "interviewer", "text": "Hello, welcome!" },
      { "sender": "candidate", "text": "Thanks, glad to be here." }
    ]
    ```
* **Validations & Requirements**:
  * User must have at least **10 credits** in their balance to call this API (otherwise triggers `402 Payment Required`).
  * If the user tier is `"trial"`, and their trial expiration date (`trial_expires_at`) has passed, request is blocked.
* **Response Format**: Streams server-sent events (`text/event-stream`) containing incremental text blocks.
* **Server-Sent Event Stream Example**:
  ```http
  data: {"choices":[{"delta":{"content":"I"}}]}
  data: {"choices":[{"delta":{"content":" optimized"}}]}
  data: {"choices":[{"delta":{"content":" database"}}]}
  data: [DONE]
  ```

---

### 2. Compile Session Summary & Evaluation
Analyzes completed session transcripts to grade candidate skills and provide scores.

* **Endpoint**: `POST /api/sessions/[id]/summary`
* **URL Params**: `[id]` = MongoDB ObjectId OR UUID `session_id`
* **Validations & Fees**:
  * **Charges 5 credits** from user balance on successful compilation.
  * Free Trial users are limited to compiling **exactly 1 evaluation report**. Subsequent requests return a `403 Forbidden` error.
  * Transcript cannot be empty.
* **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "report": {
      "communication_score": 88,
      "technical_score": 92,
      "overall_score": 90,
      "feedback": "The candidate was structured and explained microservices trade-offs beautifully. However, try to avoid over-talking on simple database index questions.",
      "improvement_guide": "Focus on the STAR method for behavioral questions. Practice explaining query planner indexes succinctly."
    }
  }
  ```
  *Note: Calling this endpoint automatically updates the session `status` to `"completed"` in the database.*

---

### 3. Streaming AI Coach Chat Assistance
Interactive follow-up coaching chat regarding the interview session.

* **Endpoint**: `POST /api/sessions/[id]/chat`
* **URL Params**: `[id]` = MongoDB ObjectId OR UUID `session_id`
* **Content-Type**: `application/json`
* **Headers**: `Accept: text/event-stream`
* **Request Payload**:
  * `prompt`: String (**Required**) — Question for the coach (e.g. `"How could I have explained Docker multi-stage builds more clearly?"`)
* **Response Format**: Streams server-sent events (`text/event-stream`) providing feedback based on the session's transcript, evaluation scores, and candidate resume.

---

## ⚠️ Error Responses Reference

Errors are returned in a standard format with appropriate HTTP Status Codes.

### 1. **`400 Bad Request`** — Validation Error
Returned when required fields are missing or invalid (e.g. creating resume without title).
```json
{
  "error": "Resume title is required"
}
```

### 2. **`401 Unauthorized`** — Authentication Failure
Returned when the JWT session token is missing, invalid, or expired.
```json
{
  "error": "Unauthorized. Valid token required."
}
```

### 3. **`402 Payment Required`** — Insufficient Credits
Returned by `/api/completion` when the user balance has fewer than 10 credits, or when the trial period has expired.
```json
{
  "error": "Insufficient credits. At least 10 credits are required to run AI Copilot. Please top up your account."
}
```

### 4. **`403 Forbidden`** — Trial Limit Exceeded
Returned when a trial user attempts to compile more than 1 evaluation report.
```json
{
  "error": "Free Trial limit reached. You can only generate exactly 1 AI report. Please purchase a plan to continue."
}
```

### 5. **`404 Not Found`** — Resource Missing
Returned when the requested resume or session ID is not found, or belongs to another user.
```json
{
  "error": "Session not found"
}
```

### 6. **`429 Too Many Requests`** — Cooldown Active
Returned by `/api/sessions/free` if a user attempts to create a new free session within 12 minutes of their last free session creation.
```json
{
  "error": "Free session cooldown active. You can only create one free session every 12 minutes."
}
```

### 7. **`500 Internal Server Error`** — Server Failure
Returned when a database error occurs or an external LLM API fails.
```json
{
  "error": "Failed to upload and parse resume"
}
```

---

## 💻 Sample Integration Code (JavaScript Fetch)

### 1. Uploading a Resume File
```javascript
const uploadResume = async (fileObject, customTitle, jwtToken) => {
  const formData = new FormData();
  formData.append('file', fileObject);
  formData.append('title', customTitle);

  const response = await fetch('http://localhost:3000/api/resumes/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }
  return data.resume;
};
```

### 2. Creating a Call Session
```javascript
const createSession = async (role, company, resumeId, jwtToken) => {
  const response = await fetch('http://localhost:3000/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({
      role: role,
      company: company,
      resume_id: resumeId,
      ai_model: 'gpt-4o-mini',
      language: 'english',
      behavior_tone: 'professional'
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create session');
  }
  return data.session;
};
```

### 3. Subscribing to Streaming AI Copilot Answers
```javascript
const subscribeToCopilot = (sessionId, promptText, jwtToken, onChunkReceived, onStreamEnd) => {
  fetch('http://localhost:3000/api/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({
      sessionId: sessionId,
      prompt: promptText,
      requestType: 'normal'
    })
  }).then(response => {
    if (!response.ok) {
      response.json().then(err => console.error('Stream init failed:', err.error));
      return;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    function read() {
      reader.read().then(({ done, value }) => {
        if (done) {
          onStreamEnd();
          return;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) onChunkReceived(content);
            } catch (_) {}
          }
        }
        read();
      });
    }
    read();
  });
};
```
