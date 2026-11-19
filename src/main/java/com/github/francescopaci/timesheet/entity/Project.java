package com.github.francescopaci.timesheet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 5, unique = true)
    private String code;

    @Column(nullable = false, length = 50)
    private String description;

    public Project(String code, String description) {
        this.code = code;
        this.description = description;
    }
}