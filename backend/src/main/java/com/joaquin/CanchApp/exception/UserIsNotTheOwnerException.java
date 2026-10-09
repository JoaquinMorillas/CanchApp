package com.joaquin.CanchApp.exception;

public class UserIsNotTheOwnerException extends Exception{
    
    public UserIsNotTheOwnerException(){
        super("El Usuario no coincide con el recurso solicitado");
    }
}
