# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend with Maven and Eclipse Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /build

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
# Copy compiled React frontend into Spring Boot static resources
COPY --from=frontend-builder /src/main/resources/static ./src/main/resources/static

RUN mvn clean package -DskipTests=true

# Stage 3: Minimal production runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=backend-builder /build/target/agri-triage-1.0.0.jar app.jar

EXPOSE 8000

ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
