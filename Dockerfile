# Stage 1: Build application with Maven and Eclipse Temurin JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy project definition and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and static assets
COPY src ./src

# Package application into an executable JAR
RUN mvn clean package -DskipTests=true

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy executable jar from builder stage
COPY --from=builder /build/target/agri-triage-1.0.0.jar app.jar

EXPOSE 8000

ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
