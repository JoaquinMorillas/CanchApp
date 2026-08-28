package com.joaquin.CanchApp.exception;

public class UserIsNotTheOwnerException extends Exception{
    
    public UserIsNotTheOwnerException(){
        super("El Usuario no es el dueño del establecimiento");
    }
}
