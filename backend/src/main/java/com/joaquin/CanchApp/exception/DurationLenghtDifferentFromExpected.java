package com.joaquin.CanchApp.exception;

import java.time.Duration;
import java.time.LocalTime;

public class DurationLenghtDifferentFromExpected extends Exception{
    private Duration expected;
    private LocalTime beginingHour;
    private LocalTime endingHour;

    public DurationLenghtDifferentFromExpected(Duration expected, LocalTime beginingHour, LocalTime endingHour){
        super("La duracion esperada es: " + expected + " pero la diferencia entre la hora de inicio y la hora de finalizacion es: " + Duration.between(beginingHour, endingHour));
    }

    public Duration getExpected() {
        return expected;
    }

    public LocalTime getBeginingHour() {
        return beginingHour;
    }

    public LocalTime getEndingHour() {
        return endingHour;
    }

}
