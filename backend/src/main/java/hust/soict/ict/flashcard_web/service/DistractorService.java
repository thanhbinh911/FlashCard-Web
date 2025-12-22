package hust.soict.ict.flashcard_web.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * Service to generate distractors (wrong answers) for multiple choice questions
 * using OpenAI API via Spring AI.
 */
@Service
public class DistractorService {
    
    private final ChatClient chatClient;
    
    public DistractorService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }
    
    /**
     * Generate wrong answers (distractors) for a flashcard.
     * 
     * @param question The flashcard question
     * @param correctAnswer The correct answer
     * @param count Number of distractors to generate (e.g., 3)
     * @return List of distractor answers
     */
    public List<String> generateDistractors(String question, String correctAnswer, int count) {
        String prompt = String.format("""
            You are helping create a multiple choice quiz. Given this question and correct answer, 
            generate exactly %d plausible but WRONG answers (distractors).
            
            Rules:
            - Each distractor should be believable and related to the topic
            - Distractors should NOT be the same as or too similar to the correct answer
            - Keep each distractor concise (similar length to the correct answer)
            - Do NOT include numbering, bullets, or any extra formatting
            
            Question: %s
            Correct Answer: %s
            
            Return ONLY %d wrong answers, one per line, nothing else:
            """, count, question, correctAnswer, count);
        
        try {
            String response = chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
            
            // Parse response into list
            return Arrays.stream(response.split("\n"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty() && !s.equalsIgnoreCase(correctAnswer))
                    .limit(count)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Fallback: return generic distractors if AI fails
            return generateFallbackDistractors(count);
        }
    }
    
    /**
     * Fallback distractors if AI service is unavailable.
     */
    private List<String> generateFallbackDistractors(int count) {
        List<String> fallback = Arrays.asList(
            "Not available",
            "None of the above", 
            "Unknown",
            "Other"
        );
        return fallback.stream().limit(count).collect(Collectors.toList());
    }
}
