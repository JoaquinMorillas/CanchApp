package com.joaquin.CanchApp.exception;

public class ReservationDateIsBeforeCurrentDate extends Exception{

    public ReservationDateIsBeforeCurrentDate(){
        super("La fecha de la reserva no puede ser anterior a la fecha actual");
    }
}


