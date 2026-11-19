package com.github.francescopaci.timesheet.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "password")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 40, unique = true)
    private String email;

    @Column(nullable = false, length = 75)
    private String password;

    @Column(name = "temporary_code")
    private Integer temporaryCode;

    @Column(nullable = false)
    private boolean active = false;

    @Column(nullable = false, length = 10)
    private String role;

    @Column(name = "data_ins", nullable = false, updatable = false)
    private Instant dataIns;

    @Column(name = "data_mod", nullable = false)
    private Instant dataMod;

    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (this.dataIns == null) {
            this.dataIns = now;
        }
        if (this.dataMod == null) {
            this.dataMod = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.dataMod = Instant.now();
    }
}