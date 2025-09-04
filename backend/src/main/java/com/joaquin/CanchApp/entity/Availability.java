package com.joaquin.CanchApp.entity;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sport_field_id")
    private SportField sportField;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek; // mandatory unless a specific date is entered. For automatitaion pourposues 

    private LocalTime beginingTime;
    private LocalTime endingTime;

    private LocalDate specificDate; // optional for overriding exising avaliabilities eg: holidays where it may be isActive=false or other begining or ending times
    @Column(name = "is_active")
    private boolean active;
}
