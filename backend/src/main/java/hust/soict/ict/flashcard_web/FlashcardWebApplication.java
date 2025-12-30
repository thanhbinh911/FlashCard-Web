package hust.soict.ict.flashcard_web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class FlashcardWebApplication {

    public static void main(String[] args) {
        // Load .env file from backend directory (where pom.xml is located)
        // ignoreIfMissing() prevents errors if .env doesn't exist (e.g., in production)
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        // Set all .env variables as system properties so Spring can access them
        // This allows using ${VAR_NAME} syntax in application.properties
        dotenv.entries().forEach(entry -> {
            if (System.getProperty(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        SpringApplication.run(FlashcardWebApplication.class, args);
    }

}