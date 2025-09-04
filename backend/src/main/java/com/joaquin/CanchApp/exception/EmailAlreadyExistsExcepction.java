package com.joaquin.CanchApp.exception;

public class EmailAlreadyExistsExcepction extends Exception{

    private String email;

    public EmailAlreadyExistsExcepction(String email){
        super("El email: " + email + " ya esta registrado");
        this.email = email;
    }

    public String getEmail(){
        return this.email;
    }
}
