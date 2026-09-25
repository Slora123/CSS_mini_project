# MAC Generator and Verifier (Virtual Labs)

> **Topic:** Generate and verify a Message Authentication Code (MAC) for a given message using a shared secret key.

An interactive cryptographic web application built in the style of **Virtual Labs (An MoE Govt of India Initiative)**.

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** React + Vite (Custom Virtual Labs UI theme)
- **Backend:** Node.js with Express (`/api/mac/generate`, `/api/mac/verify`, `/api/mac/key-generate`)
- **Core Security Module:** Java (`javax.crypto.Mac` handling HMAC-SHA256, HMAC-SHA512, HMAC-MD5)
- **Bridge:** Express child process bridge to Java security runtime with high-availability fallback.

---

## 📁 Repository Structure

```
CSS_mini_project/
├── java_security/
│   └── MacSecurityModule.java      # Java Cryptography Engine (javax.crypto.Mac)
├── server/
│   ├── server.js                   # Express REST API Server
│   └── javaRunner.js               # Java execution bridge & fallback runner
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Virtual Labs Navigation Header & Rating
│   │   ├── Sidebar.jsx             # Left Navigation Tabs (Aim, Theory, etc.)
│   │   ├── AimSection.jsx          # Experiment Aim
│   │   ├── TheorySection.jsx       # Cryptographic Theory & RFC 2104 HMAC Math
│   │   ├── ObjectiveSection.jsx    # Learning Objectives
│   │   ├── ProcedureSection.jsx    # Step-by-Step Procedure
│   │   ├── SimulationSection.jsx   # Interactive MAC Generator, Verifier & Eve MITM
│   │   ├── AssignmentSection.jsx   # Quiz & Self-Assessment
│   │   ├── ReferencesSection.jsx   # Standards & RFCs
│   │   └── FeedbackSection.jsx     # User Feedback Form
│   ├── App.jsx                     # Layout & Navigation Manager
│   ├── index.css                   # Virtual Labs CSS Theme
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js:** v18+ 
- **Java JDK:** Java 8+ (Java 24 verified)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Slora123/CSS_mini_project.git
   cd CSS_mini_project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile Java Security Module:**
   ```bash
   npm run compile-java
   ```

4. **Start the Development Server (Backend + Frontend):**
   ```bash
   npm run dev
   ```
   - **Frontend UI:** Open [http://localhost:3000](http://localhost:3000)
   - **Backend API:** Listening on [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Features

1. **Aim & Theory:** Detailed RFC 2104 HMAC breakdown ($H( (K \oplus \text{opad}) \parallel H( (K \oplus \text{ipad}) \parallel M ) )$).
2. **Interactive MAC Generator:** Real-time generation of HMAC tags using Java `javax.crypto.Mac` with secret key auto-generation.
3. **Constant-Time MAC Verifier:** Verifies message authenticity and integrity using `MessageDigest.isEqual` to prevent timing side-channel attacks.
4. **Eve MITM Attack Simulator:** Interactive simulation showing how tampering with message bits or MAC tags triggers instant verification failure.
5. **Self-Assessment Quiz:** Interactive quiz with instant feedback and score computation.
