package com.joaquin.CanchApp.exception;

import java.time.LocalTime;

public class BeginingTimeIsAfterEndingTimeException extends Exception{
    private LocalTime beginingTime;
    private LocalTime endingTime;

    public BeginingTimeIsAfterEndingTimeException(LocalTime beginingTime, LocalTime endingTime){
        super("La hora de inicio: " + beginingTime + " debe ser anterior a la hora de finalizacion: " + endingTime);
    }

    public LocalTime getBeginingTime() {
        return beginingTime;
    }

    public LocalTime getEndingTime() {
        return endingTime;
    }

    
}
