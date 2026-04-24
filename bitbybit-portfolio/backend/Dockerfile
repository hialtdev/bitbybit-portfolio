FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Ensure the upload directory exists and has correct permissions
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# We use a more specific glob to ensure we get the actual executable JAR
# Note: Ensure you run 'mvn clean package' before building this image
COPY target/bitbybit-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]