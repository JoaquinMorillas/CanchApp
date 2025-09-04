package com.joaquin.CanchApp.exception;

import java.time.LocalTime;

public class ReservationBeginingHourNotAvailableException extends Exception{
    private LocalTime hour;

    public LocalTime getHour() {
        return hour;
    }

    public ReservationBeginingHourNotAvailableException(LocalTime hour){
        super("La hora de inicio: " + hour + " no esta disponible.");
    }

}
