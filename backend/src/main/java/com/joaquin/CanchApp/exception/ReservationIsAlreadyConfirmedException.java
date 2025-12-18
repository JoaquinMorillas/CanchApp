package com.joaquin.CanchApp.exception;

public class ReservationIsAlreadyConfirmedException extends Exception{

    public ReservationIsAlreadyConfirmedException(){
        super("La reserva ya esta confirmada por otro usuario, por favor intenta con otra...");
    }

}
