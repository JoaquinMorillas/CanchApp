package com.joaquin.CanchApp.exception;

public class StablishmentNameAlreadyExistsException extends Exception{
    private String name;

    public StablishmentNameAlreadyExistsException(String name){
        super("El nombre: " + name +" ya ha sido registrado");
    }

    public String getName(){
        return this.name;
    }

}
