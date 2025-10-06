package com.joaquin.CanchApp.exception;

public class EmailNotFoundExeption extends Exception {
    private String email;

    public EmailNotFoundExeption(String email){
        super("El correo " + email + " No ha sido encontrado");
        this.email = email;
    }

    public String getEmail(){
        return this.email;
    }

}
