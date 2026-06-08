#stage 1 - build ( compile ) 
FROM eclipse-temurin:25 AS build
WORKDIR /app 
COPY . .
RUN ./mvnw clean package -DskipTests

#stage 2 - runtime 
FROM eclipse-temurin:25-jre
WORKDIR /app 
COPY --from=build /app/target/*.jar app.jar 
EXPOSE 8181 
ENTRYPOINT ["java", "-jar", "app.jar"]

