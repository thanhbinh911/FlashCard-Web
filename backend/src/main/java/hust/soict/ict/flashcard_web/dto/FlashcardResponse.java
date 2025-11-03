package hust.soict.ict.flashcard_web.dto;

public class FlashcardResponse {
    private Long id;
    private String questionText;
    private String answerText;
    private String hint;

    public FlashcardResponse(Long id, String questionText, String answerText, String hint) {
        this.id = id;
        this.questionText = questionText;
        this.answerText = answerText;
        this.hint = hint;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getAnswerText() {
        return answerText;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }
}