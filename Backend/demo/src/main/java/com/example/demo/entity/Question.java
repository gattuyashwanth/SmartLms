package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "quiz_questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false)
    private Double marks = 2.0;

    public Question() {}

    public Question(Quiz quiz, String questionText, Double marks) {
        this.quiz = quiz;
        this.questionText = questionText;
        this.marks = marks;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public Double getMarks() { return marks; }
    public void setMarks(Double marks) { this.marks = marks; }
}
