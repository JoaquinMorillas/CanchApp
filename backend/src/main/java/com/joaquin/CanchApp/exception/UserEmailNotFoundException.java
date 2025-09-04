package com.joaquin.CanchApp.exception;


public class UserEmailNotFoundException extends Exception {

    private String email;

    public UserEmailNotFoundException(String email){
        super("El usuario con email: " + email + " no ha sido encontrado");
        this.email = email;
    }

    public String email(){
        return this.email;
    }

}
