package hust.soict.ict.flashcard_web.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hust.soict.ict.flashcard_web.dto.SessionResultResponse;
import hust.soict.ict.flashcard_web.dto.SessionSummaryResponse;
import hust.soict.ict.flashcard_web.entity.DeckEntity;
import hust.soict.ict.flashcard_web.entity.FlashcardEntity;
import hust.soict.ict.flashcard_web.entity.SessionFlashcardEntity;
import hust.soict.ict.flashcard_web.entity.StudySessionEntity;
import hust.soict.ict.flashcard_web.entity.UserEntity;
import hust.soict.ict.flashcard_web.exception.ResourceNotFoundException;
import hust.soict.ict.flashcard_web.repository.DeckRepository;
import hust.soict.ict.flashcard_web.repository.FlashcardRepository;
import hust.soict.ict.flashcard_web.repository.SessionFlashcardRepository;
import hust.soict.ict.flashcard_web.repository.StudySessionRepository;
import hust.soict.ict.flashcard_web.security.SecurityService;
import hust.soict.ict.flashcard_web.service.sessionmode.SessionMode;
import hust.soict.ict.flashcard_web.service.sessionmode.SessionModeFactory;

/**
 * Service for managing study sessions.
 * Uses Strategy Pattern for different session modes (REGULAR, MCQ, REVIEW).
 */
@Service
public class StudySessionService {
    
    private final DeckRepository deckRepository;
    private final FlashcardRepository flashcardRepository;
    private final StudySessionRepository sessionRepository;
    private final SessionFlashcardRepository sessionFlashcardRepository;
    private final SecurityService securityService;
    private final SessionModeFactory sessionModeFactory;

    public StudySessionService(DeckRepository deckRepository, FlashcardRepository flashcardRepository,
                               StudySessionRepository sessionRepository, SessionFlashcardRepository sessionFlashcardRepository,
                               SecurityService securityService, SessionModeFactory sessionModeFactory) {
        this.deckRepository = deckRepository;
        this.flashcardRepository = flashcardRepository;
        this.sessionRepository = sessionRepository;
        this.sessionFlashcardRepository = sessionFlashcardRepository;
        this.securityService = securityService;
        this.sessionModeFactory = sessionModeFactory;
    }

    /**
     * Create a new study session.
     * Throws if user already has an active session for this deck.
     */
    @Transactional
    public StudySessionEntity createNewSession(Long deckId, Authentication authentication, 
                                                Long timeLimitSeconds, Boolean isPracticeMode, String sessionMode) {
        if (deckId == null) {
            throw new IllegalArgumentException("Deck ID cannot be null");
        }
        
        Long authUserId = securityService.getAuthUserId(authentication);
        DeckEntity deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));

        // Check if user already has an active session for this deck
        Optional<StudySessionEntity> existing = sessionRepository.findByUser_IdAndDeck_IdAndStatus(
                authUserId, deckId, StudySessionEntity.SessionStatus.IN_PROGRESS);
        if (existing.isPresent()) {
            throw new IllegalStateException("Active session already exists for this deck. Resume or abandon it first.");
        }

        // Validate and normalize session mode
        String normalizedMode = (sessionMode == null || sessionMode.isBlank()) 
                ? "REGULAR" 
                : sessionMode.toUpperCase();

        StudySessionEntity s = new StudySessionEntity();
        UserEntity user = new UserEntity();
        user.setId(authUserId);
        s.setUser(user);
        s.setDeck(deck);
        s.setTimeLimitSeconds(timeLimitSeconds);
        s.setIsPracticeMode(isPracticeMode != null && isPracticeMode);
        s.setSessionMode(normalizedMode);
        s.setStatus(StudySessionEntity.SessionStatus.IN_PROGRESS);

        List<FlashcardEntity> cards = flashcardRepository.findByDeck_Id(deckId);
        s.setTotalCards(cards != null ? cards.size() : 0);

        s = sessionRepository.save(s);

        // Shuffle and create session flashcard rows
        if (cards != null && !cards.isEmpty()) {
            Collections.shuffle(cards);
            List<SessionFlashcardEntity> rows = new ArrayList<>();
            int pos = 1;
            for (FlashcardEntity f : cards) {
                SessionFlashcardEntity row = new SessionFlashcardEntity();
                row.setSession(s);
                row.setFlashcard(f);
                row.setPosition(pos++);
                rows.add(row);
            }
            sessionFlashcardRepository.saveAll(rows);
        }

        return s;
    }

    /**
     * Resume an existing in-progress session.
     */
    @Transactional(readOnly = true)
    public StudySessionEntity resumeSession(Long sessionId, Authentication authentication) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        
        StudySessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        securityService.verifySessionOwnership(sessionId, authentication);
        
        if (session.getStatus() != StudySessionEntity.SessionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Session is not in progress. Status: " + session.getStatus());
        }
        
        return session;
    }

    /**
     * Abandon a session without completing it.
     * User can then start a fresh session.
     */
    @Transactional
    public void abandonSession(Long sessionId, Authentication authentication) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        
        StudySessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        securityService.verifySessionOwnership(sessionId, authentication);
        
        if (session.getStatus() != StudySessionEntity.SessionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only abandon in-progress sessions");
        }
        
        session.setStatus(StudySessionEntity.SessionStatus.ABANDONED);
        session.setEndedAt(LocalDateTime.now());
        sessionRepository.save(session);
    }

    /**
     * Save session progress (remaining time).
     * Updates timeLimitSeconds to the remaining time so it can be resumed later.
     * 
     * @param sessionId Session to save progress for
     * @param remainingSeconds Remaining time from frontend timer
     * @param authentication Current user
     */
    @Transactional
    public void saveProgress(Long sessionId, Long remainingSeconds, Authentication authentication) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        if (remainingSeconds == null || remainingSeconds < 0) {
            throw new IllegalArgumentException("Remaining seconds must be a non-negative value");
        }
        
        StudySessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        securityService.verifySessionOwnership(sessionId, authentication);
        
        if (session.getStatus() != StudySessionEntity.SessionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only save progress for in-progress sessions");
        }
        
        // Update timeLimitSeconds to remaining time for resume
        session.setTimeLimitSeconds(remainingSeconds);
        sessionRepository.save(session);
    }

    /**
     * Get questions for a session, formatted according to its mode.
     * Uses Strategy Pattern to return appropriate format.
     */
    @Transactional
    public Object getSessionQuestions(Long sessionId) {
        StudySessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        
        SessionMode mode = sessionModeFactory.getMode(session.getSessionMode());
        List<SessionFlashcardEntity> flashcards = getSessionFlashcards(sessionId);
        
        return mode.getQuestions(flashcards);
    }

    /**
     * Finish a session with all answers submitted at once.
     */
    @Transactional
    public SessionResultResponse finishSession(Long sessionId, List<AnswerSubmission> answers, Authentication authentication) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        
        StudySessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Study session not found"));

        securityService.verifySessionOwnership(sessionId, authentication);

        if (session.getStatus() == StudySessionEntity.SessionStatus.COMPLETED) {
            throw new IllegalStateException("Session already finished");
        }

        // Get the appropriate mode for answer checking
        SessionMode mode = sessionModeFactory.getMode(session.getSessionMode());

        // Process all submitted answers
        if (answers != null && !answers.isEmpty() && mode.tracksAnswers()) {
            for (AnswerSubmission answer : answers) {
                if (answer.flashcardId() == null) continue;
                
                Optional<SessionFlashcardEntity> rowOpt = sessionFlashcardRepository
                        .findBySession_IdAndFlashcard_Id(sessionId, answer.flashcardId());
                
                if (rowOpt.isPresent()) {
                    SessionFlashcardEntity row = rowOpt.get();
                    
                    // Use strategy pattern to check answer
                    boolean correct = mode.checkAnswer(row, answer.userAnswer());
                    
                    row.setUserAnswer(answer.userAnswer());
                    row.setCorrect(correct);
                    sessionFlashcardRepository.save(row);
                }
            }
        }

        return completeSession(session);
    }

    /**
     * Get the user's currently active session.
     */
    @Transactional(readOnly = true)
    public StudySessionEntity getActiveSession(Authentication authentication) {
        Long authUserId = securityService.getAuthUserId(authentication);
        return sessionRepository.findFirstByUser_IdAndStatus(authUserId, StudySessionEntity.SessionStatus.IN_PROGRESS)
                .orElse(null);
    }

    /**
     * Get all flashcards for a session (raw format).
     */
    @Transactional(readOnly = true)
    public List<SessionFlashcardEntity> getSessionFlashcards(Long sessionId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        return sessionFlashcardRepository.findBySession_Id(sessionId).stream()
                .sorted(Comparator.comparingInt(SessionFlashcardEntity::getPosition))
                .collect(Collectors.toList());
    }

    /**
     * Complete a session and calculate results.
     */
    private SessionResultResponse completeSession(StudySessionEntity session) {
        if (session.getStatus() != StudySessionEntity.SessionStatus.COMPLETED) {
            session.setEndedAt(LocalDateTime.now());
            session.setStatus(StudySessionEntity.SessionStatus.COMPLETED);
        }
        sessionRepository.save(session);

        List<SessionFlashcardEntity> attempts = sessionFlashcardRepository.findBySession_Id(session.getId());
        
        int correctCount = (int) attempts.stream()
                .filter(a -> Boolean.TRUE.equals(a.getCorrect()))
                .count();
        
        session.setCorrectAnswersCount(correctCount);
        sessionRepository.save(session);

        int total = session.getTotalCards() != null ? session.getTotalCards() : 0;
        return new SessionResultResponse(session.getId(), correctCount, total, session.getEndedAt());
    }

    /**
     * Get session summary with question details.
     */
    @Transactional(readOnly = true)
    public SessionSummaryResponse getSessionSummary(Long sessionId, Authentication authentication) {
        if (sessionId == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }

        StudySessionEntity session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        securityService.verifySessionOwnership(sessionId, authentication);

        List<SessionFlashcardEntity> attempts = sessionFlashcardRepository.findBySession_Id(sessionId);
        int correctCount = (int) attempts.stream()
                .filter(a -> Boolean.TRUE.equals(a.getCorrect()))
                .count();

        List<SessionSummaryResponse.QuestionSummary> questionSummaries = attempts.stream()
                .sorted(Comparator.comparingInt(SessionFlashcardEntity::getPosition))
                .map(row -> {
                    FlashcardEntity flashcard = row.getFlashcard();
                    return new SessionSummaryResponse.QuestionSummary(
                            flashcard != null ? flashcard.getId() : null,
                            row.getPosition(),
                            flashcard != null ? flashcard.getQuestion() : null,
                            row.getUserAnswer(),
                            flashcard != null ? flashcard.getAnswer() : null,
                            row.getCorrect()
                    );
                })
                .collect(Collectors.toList());

        return new SessionSummaryResponse(
                session.getId(),
                session.getDeck() != null ? session.getDeck().getId() : null,
                session.getDeck() != null ? session.getDeck().getTitle() : null,
                session.getStartedAt(),
                session.getEndedAt(),
                session.getTotalCards(),
                correctCount,
                session.getIsPracticeMode(),
                questionSummaries
        );
    }



    /**
     * Record for answer submission.
     */
    public record AnswerSubmission(Long flashcardId, String userAnswer) {}


}
