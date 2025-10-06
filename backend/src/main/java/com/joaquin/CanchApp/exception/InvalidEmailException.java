package com.joaquin.CanchApp.exception;

public class InvalidEmailException extends Exception{
    private String email;

    public InvalidEmailException(String email){
        super("El correo: " + email + " No es valido");
        this.email = email;
    }

    public String getEmail(){
        return this.email;
    }

}
