package com.joaquin.CanchApp.exception;

public class ReservationUserIsNullException extends Exception{

    public ReservationUserIsNullException(){
        super("La reserva no tiene ningun usuario asociado");
    }

}
