FROM maven:3.6-jdk-8-alpine AS build

WORKDIR /app

# Copy the Maven POM and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:8-jre-alpine

WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/bank-app-1.0.0.jar app.jar

# Expose the port the app runs on
EXPOSE 8989

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 