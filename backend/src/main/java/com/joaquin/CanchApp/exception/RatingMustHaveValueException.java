package com.joaquin.CanchApp.exception;

public class RatingMustHaveValueException extends Exception{

    public RatingMustHaveValueException(){
        super("La puntuacion enviada no tiene un valor asignado");
    }
    
}
