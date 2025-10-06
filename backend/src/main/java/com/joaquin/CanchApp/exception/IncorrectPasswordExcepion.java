package com.joaquin.CanchApp.exception;

public class IncorrectPasswordExcepion extends Exception{

    public IncorrectPasswordExcepion(){
        super("La contraseña Ingresada es incorrecta");
    }

}
