package CapstoneConnect.Capstone_1.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class RequestEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private UserEntity sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private UserEntity receiver;

    @Column(nullable = false)
    private String status; // SENT, CANCELLED, ACCEPTED, REJECTED

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "match_score")
    private Double matchScore; // Compatibility score between sender and receiver

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserEntity getSender() { return sender; }
    public void setSender(UserEntity sender) { this.sender = sender; }
    public UserEntity getReceiver() { return receiver; }
    public void setReceiver(UserEntity receiver) { this.receiver = receiver; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
}
