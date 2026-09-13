# AgriTriage — Agriculture Support Intelligence Agent (Spring Boot)

[![CI/CD Pipeline](https://github.com/aadity-a/AgriTriage_JAVA/actions/workflows/ci.yml/badge.svg)](https://github.com/aadity-a/AgriTriage_JAVA/actions/workflows/ci.yml)

Production-grade reactive triage agent for agricultural communications.  
Built with **Java 21** + **Spring Boot 3** + **Groq Cloud LLM (`llama-3.1-8b-instant`)** + **Vanilla HTML/CSS/JS**.

- ⚡ **High-Throughput Reactive Processing**: Spring Boot REST backend with Groq LLM integration.
- 🌾 **Domain-Specific Triage**: Classifies urgency, detects intent, extracts named entities (farmer ID, crop, location, dates, keywords), drafts responses, and generates summaries.
- 🐳 **Docker & Containerization**: Multi-stage build with Eclipse Temurin JDK/JRE 21.
- ☸️ **Kubernetes Ready**: Complete manifests for deployment, services, and secret management.
- 🔄 **Automated CI/CD**: Dual-pipeline support with GitHub Actions and Jenkins.

---

## 🏗️ Project Architecture

```
AgriTriage/
├── pom.xml                                   # Maven dependencies & build configuration
├── mvnw / mvnw.cmd                           # Maven wrapper scripts
├── Dockerfile                                # Multi-stage Docker build (Maven + JRE 21)
├── docker-compose.yml                        # Local multi-container orchestration
├── Jenkinsfile                               # Declarative Jenkins CI/CD pipeline
├── .github/workflows/ci.yml                  # GitHub Actions workflow
├── k8s/                                      # Kubernetes manifests
│   ├── deployment.yaml                       # App deployment specs
│   ├── service.yaml                          # ClusterIP / LoadBalancer service
│   └── secret.yaml                           # Environment secret definitions
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
│   │       └── static/                       # Static UI assets (HTML, CSS, JS)
│   └── test/
│       └── java/com/agritriage/              # MockMvc & unit test suite
├── HLD.pdf                                   # High-Level Architecture Design
└── LLD.pdf                                   # Low-Level Architecture Design
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21 LTS** ([Eclipse Temurin](https://adoptium.net/) or Oracle JDK)
- **Apache Maven 3.9+** (or use the included `./mvnw`)
- **Docker** & **Docker Compose** (optional, for containerized run)
- **Groq API Key**: Obtain a key from [console.groq.com](https://console.groq.com)

---

### Local Setup & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aadity-a/AgriTriage_JAVA.git
   cd AgriTriage_JAVA
   ```

2. **Configure Environment Variables**:
   Create a `.env` file or export your Groq API key:
   ```bash
   export GROQ_API_KEY=gsk_your_key_here
   ```
   *(On Windows PowerShell: `$env:GROQ_API_KEY="gsk_your_key_here"`)*

3. **Run Unit Tests**:
   ```bash
   mvn clean test
   ```

4. **Start the Application**:
   ```bash
   mvn spring-boot:run
   ```
   The dashboard will be available at: **`http://localhost:8000`**

---

### 🐳 Running with Docker

Build and start the containerized application with Docker Compose:

```bash
docker compose up --build
```

Or build and run directly with Docker:

```bash
docker build -t aaditya0421/agri-triage:latest .
docker run -p 8000:8000 -e GROQ_API_KEY="gsk_your_key_here" aaditya0421/agri-triage:latest
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
      "issue_keywords": ["yellow rust", "leaves turning powder-yellow", "spreading fast"]
    },
    "draft_response": "Dear Harpreet Singh, we acknowledge the urgent threat of yellow rust on your wheat crop in Ludhiana. Please immediately isolate the affected 5-acre section and consider applying a recommended fungicide such as Propiconazole. An agricultural extension officer has been notified for expedited field inspection. We will stand by you to resolve this.",
    "summary": "Urgent yellow rust outbreak on 5 acres of wheat in Ludhiana requires immediate fungicide intervention.",
    "processing_time_ms": 680
  }
  ```

---

## 🧪 Testing

Comprehensive unit and integration tests are included:
```bash
mvn test
```

Test coverage includes:
- `AgriTriageApplicationTests`: Spring Boot application context load verification.
- `TriageControllerTest`: MockMvc web layer tests verifying `/api/health`, `/api/triage`, input validation (`400 Bad Request`), and JSON serialization.
- `GroqClientServiceTest`: JSON fence stripping, fallback parsing, and error handling.

---

## ☸️ Kubernetes Deployment

Deploy manifests to your Kubernetes cluster:

```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

## 📄 License

This project is licensed under the Apache 2.0 License.
