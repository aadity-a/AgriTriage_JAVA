# AgriTriage — Agriculture Support Intelligence Agent (Spring Boot + React)

[![CI/CD Pipeline](https://github.com/aadity-a/AgriTriage_JAVA/actions/workflows/ci.yml/badge.svg)](https://github.com/aadity-a/AgriTriage_JAVA/actions/workflows/ci.yml)

Production-grade reactive triage agent for agricultural communications.  
Built with **Java 21** + **Spring Boot 3** + **Groq Cloud LLM (`llama-3.1-8b-instant`)** + **React (Vite)**.

- ⚡ **High-Throughput Reactive Processing**: Spring Boot REST backend with Groq LLM integration.
- ⚛️ **Modern React Frontend**: Component-driven UI with Vite, Lucide icons, glassmorphism aesthetics, and real-time triage animations.
- 🌾 **Domain-Specific Triage**: Classifies urgency, detects intent, extracts named entities (farmer ID, crop, location, dates, keywords), drafts responses, and generates summaries.
- 🐳 **Docker & Containerization**: Multi-stage build with Node.js 22, Maven 3.9, and Eclipse Temurin JRE 21.
- ☸️ **Kubernetes Ready**: Complete manifests for deployment, services, and secret management.
- 🔄 **Automated CI/CD**: Dual-pipeline support with GitHub Actions and Jenkins.

---

## 🏗️ Project Architecture

```
AgriTriage/
├── pom.xml                                   # Maven dependencies & build configuration
├── mvnw / mvnw.cmd                           # Maven wrapper scripts
├── Dockerfile                                # Multi-stage Docker build (Node + Maven + JRE 21)
├── docker-compose.yml                        # Local multi-container orchestration
├── Jenkinsfile                               # Declarative Jenkins CI/CD pipeline
├── .github/workflows/ci.yml                  # GitHub Actions workflow
├── k8s/                                      # Kubernetes manifests
│   ├── deployment.yaml                       # App deployment specs
│   ├── service.yaml                          # ClusterIP / LoadBalancer service
│   └── secret.yaml                           # Environment secret definitions
├── frontend/                                 # Modern React + Vite SPA
│   ├── package.json                          # React, Lucide-React & Vite dependencies
│   ├── vite.config.js                        # Dev proxy & static build output
│   ├── index.html                            # HTML entrypoint with custom typography
│   └── src/
│       ├── main.jsx                          # React DOM root
│       ├── App.jsx                           # Application shell & state machine
│       ├── index.css                         # Dark glassmorphism design system
│       ├── components/                       # Header, Input, Gauge, Entity, Draft cards
│       └── services/api.js                   # Backend REST API integration
├── src/
│   ├── main/
│   │   ├── java/com/agritriage/
│   │   │   ├── AgriTriageApplication.java    # Spring Boot application entrypoint
│   │   │   ├── config/                       # Web MVC, CORS, and Groq properties
│   │   │   ├── controller/                   # REST controller (/api/triage, /api/health)
│   │   │   ├── dto/                          # Request, response, and entity models
│   │   │   └── service/                      # Groq client & 4-stage triage pipeline
│   │   └── resources/
│   │       ├── application.yml               # Application configuration
│   │       └── static/                       # Compiled production React distribution
│   └── test/
│       └── java/com/agritriage/              # MockMvc & unit test suite
├── HLD.pdf                                   # High-Level Architecture Design
└── LLD.pdf                                   # Low-Level Architecture Design
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21 LTS** ([Eclipse Temurin](https://adoptium.net/) or Oracle JDK)
- **Node.js 20+** & **npm** (for frontend development)
- **Apache Maven 3.9+** (or use the included `./mvnw`)
- **Docker** & **Docker Compose** (optional, for containerized run)
- **Groq API Key**: Obtain a key from [console.groq.com](https://console.groq.com)

---

### Local Setup & Execution

1. **Configure Environment Variables**:
   ```bash
   export GROQ_API_KEY=gsk_your_key_here
   ```
   *(On Windows PowerShell: `$env:GROQ_API_KEY="gsk_your_key_here"`)*

2. **Option A: Run Full Application (Spring Boot + Bundled React)**:
   ```bash
   # Build the React frontend
   cd frontend
   npm install
   npm run build
   cd ..

   # Run Spring Boot (serves both API and React frontend on port 8000)
   mvn spring-boot:run
   ```
   Open **`http://localhost:8000`** in your browser.

3. **Option B: Run in Frontend Dev Mode (Hot Reloading)**:
   ```bash
   # Terminal 1: Backend
   mvn spring-boot:run

   # Terminal 2: React Vite Dev Server
   cd frontend
   npm run dev
   ```
   Open **`http://localhost:5173`** (automatically proxies API requests to `http://localhost:8000`).

---

### 🐳 Running with Docker

Build and start the containerized application with Docker Compose:

```bash
docker compose up --build
```

---

## 📡 API Reference

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

### 2. Process Triage
- **Endpoint**: `POST /api/triage`
- **Request Body**:
  ```json
  {
    "message": "Severe yellow rust observed on wheat crops across 5 acres in Ludhiana. Leaves turning powder-yellow, spreading fast.",
    "sender_name": "Harpreet Singh",
    "sender_email": "harpreet@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "urgency": "HIGH",
    "urgency_score": 9,
    "intent": "Crop Disease Report",
    "entities": {
      "farmer_id": null,
      "crop_type": "wheat",
      "location": "Ludhiana",
      "dates": [],
      "issue_keywords": ["yellow rust", "powder-yellow", "spreading fast"]
    },
    "draft_response": "Dear Harpreet Singh, we acknowledge the urgent threat of yellow rust on your wheat crop in Ludhiana...",
    "summary": "Urgent yellow rust outbreak on 5 acres of wheat in Ludhiana requires immediate fungicide intervention.",
    "processing_time_ms": 680
  }
  ```

---

## 🧪 Testing

Run backend tests:
```bash
mvn test
```

Build and validate frontend:
```bash
cd frontend && npm run build
```

---

## ☸️ Kubernetes Deployment

```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

## 📄 License

This project is licensed under the Apache 2.0 License.
