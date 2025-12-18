package com.joaquin.CanchApp.exception;

public class ReservationUserIdIsDiferentFromTheIdSuppliedException extends Exception{

    public ReservationUserIdIsDiferentFromTheIdSuppliedException(){
        super("El id del usuario que quiere hacer la cancelacion no es el mismo que ha hecho la reserva");
    }

}
