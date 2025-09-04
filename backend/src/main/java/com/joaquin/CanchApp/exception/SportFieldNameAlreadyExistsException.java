package com.joaquin.CanchApp.exception;

public class SportFieldNameAlreadyExistsException extends Exception{

    private String name;

    public SportFieldNameAlreadyExistsException(String name){
        super("La cancha con nombre: " + name + " ya existe");

    }
    public String getName(){
        return this.name;
    }

}
