package hust.soict.ict.flashcard_web.controller;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hust.soict.ict.flashcard_web.dto.ActiveSessionResponse;
import hust.soict.ict.flashcard_web.dto.CreateSessionRequest;
import hust.soict.ict.flashcard_web.dto.FinishSessionRequest;
import hust.soict.ict.flashcard_web.dto.SaveProgressRequest;
import hust.soict.ict.flashcard_web.dto.SessionFlashcardDto;
import hust.soict.ict.flashcard_web.dto.SessionResultResponse;
import hust.soict.ict.flashcard_web.dto.SessionSummaryResponse;
import hust.soict.ict.flashcard_web.dto.StartSessionResponse;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;
import hust.soict.ict.flashcard_web.entity.StudySessionEntity;
import hust.soict.ict.flashcard_web.service.StudySessionService;

/**
 * Controller for study sessions.
 * Supports multiple session modes via Strategy Pattern.
 * 
 * Endpoints:
 * - POST /start     → Create new session (fails if active exists)
 * - POST /{id}/resume → Resume existing session
 * - DELETE /{id}/abandon → Abandon session without completing
 * - GET /active     → Get current active session
 * - POST /{id}/finish → Complete session with answers
 * - GET /{id}/summary → Get completed session results
 */
@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {
    
    private final StudySessionService studySessionService;

    public StudySessionController(StudySessionService studySessionService) {
        this.studySessionService = studySessionService;
    }

    // ==================== SESSION LIFECYCLE ====================

    /**
     * Create a new session.
     * Fails if user already has an active session for this deck.
     */
    @PostMapping("/start")
    public ResponseEntity<?> startSession(@RequestBody CreateSessionRequest req,
                                          Authentication authentication) {
        StudySessionEntity session = studySessionService.createNewSession(
                req.getDeckId(), 
                authentication, 
                req.getTimeLimitSeconds(), 
                req.getIsPracticeMode(),
                req.getSessionMode()
        );
        
        Object questions = studySessionService.getSessionQuestions(session.getId());
        
        StartSessionResponse response = new StartSessionResponse(
                session.getId(),
                session.getStartedAt(),
                session.getTimeLimitSeconds(),
                session.getStatus().name(),
                session.getIsPracticeMode(),
                session.getSessionMode(),
                questions
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Resume an existing in-progress session.
     */
    @PostMapping("/{sessionId}/resume")
    public ResponseEntity<?> resumeSession(@PathVariable Long sessionId,
                                           Authentication authentication) {
        StudySessionEntity session = studySessionService.resumeSession(sessionId, authentication);
        
        Object questions = studySessionService.getSessionQuestions(session.getId());
        
        StartSessionResponse response = new StartSessionResponse(
                session.getId(),
                session.getStartedAt(),
                session.getTimeLimitSeconds(),
                session.getStatus().name(),
                session.getIsPracticeMode(),
                session.getSessionMode(),
                questions
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * Abandon a session without completing it.
     * User can then start a fresh session for the same deck.
     */
    @DeleteMapping("/{sessionId}/abandon")
    public ResponseEntity<Void> abandonSession(@PathVariable Long sessionId,
                                               Authentication authentication) {
        studySessionService.abandonSession(sessionId, authentication);
        return ResponseEntity.noContent().build();
    }

    /**
     * Save session progress (remaining time).
     * Called when user manually saves or exits the page.
     * On resume, the saved remainingSeconds will be returned as timeLimitSeconds.
     */
    @PostMapping("/{sessionId}/save-progress")
    public ResponseEntity<Void> saveProgress(@PathVariable Long sessionId,
                                             @RequestBody SaveProgressRequest req,
                                             Authentication authentication) {
        studySessionService.saveProgress(sessionId, req.getRemainingSeconds(), authentication);
        return ResponseEntity.noContent().build();
    }


    /**
     * Finish a session with all answers.
     */
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<SessionResultResponse> finishSession(@PathVariable Long sessionId,
                                                               @RequestBody(required = false) FinishSessionRequest req,
                                                               Authentication authentication) {
        List<StudySessionService.AnswerSubmission> answers = Collections.emptyList();
        if (req != null && req.getAnswers() != null) {
            answers = req.getAnswers().stream()
                    .map(a -> new StudySessionService.AnswerSubmission(a.getFlashcardId(), a.getUserAnswer()))
                    .collect(Collectors.toList());
        }
        
        SessionResultResponse result = studySessionService.finishSession(sessionId, answers, authentication);
        return ResponseEntity.ok(result);
    }

    // ==================== SESSION QUERIES ====================

    /**
     * Get the current active session for the authenticated user.
     */
    @GetMapping("/active")
    public ResponseEntity<ActiveSessionResponse> getActiveSession(Authentication authentication) {
        StudySessionEntity session = studySessionService.getActiveSession(authentication);
        if (session == null) {
            return ResponseEntity.noContent().build();
        }
        
        List<SessionFlashcardEntity> flashcardEntities = studySessionService.getSessionFlashcards(session.getId());
        List<SessionFlashcardDto> flashcards = flashcardEntities.stream()
                .map(this::toSessionFlashcardDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(new ActiveSessionResponse(
                session.getId(),
                session.getDeck().getId(),
                session.getDeck().getTitle(),
                session.getStartedAt(),
                session.getTimeLimitSeconds(),
                session.getStatus().name(),
                session.getTotalCards(),
                session.getIsPracticeMode(),
                flashcards
        ));
    }

    /**
     * Get questions for an existing session (formatted by mode).
     */
    @GetMapping("/{sessionId}/questions")
    public ResponseEntity<?> getSessionQuestions(@PathVariable Long sessionId) {
        Object questions = studySessionService.getSessionQuestions(sessionId);
        return ResponseEntity.ok(questions);
    }

    /**
     * Get the full summary of a completed session.
     */
    @GetMapping("/{sessionId}/summary")
    public ResponseEntity<SessionSummaryResponse> getSessionSummary(@PathVariable Long sessionId,
                                                                    Authentication authentication) {
        SessionSummaryResponse summary = studySessionService.getSessionSummary(sessionId, authentication);
        return ResponseEntity.ok(summary);
    }

    // ==================== HELPER METHODS & RECORDS ====================

    private SessionFlashcardDto toSessionFlashcardDto(SessionFlashcardEntity entity) {
        FlashcardEntity flashcard = entity.getFlashcard();
        
        return SessionFlashcardDto.builder()
                .flashcardId(flashcard != null ? flashcard.getId() : null)
                .position(entity.getPosition())
                .questionText(flashcard != null ? flashcard.getQuestion() : null)
                .hint(flashcard != null ? flashcard.getHint() : null)
                .build();
    }
}
