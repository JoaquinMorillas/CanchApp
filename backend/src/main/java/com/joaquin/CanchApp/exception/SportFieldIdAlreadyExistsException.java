package com.joaquin.CanchApp.exception;

public class SportFieldIdAlreadyExistsException extends Exception{
    private Integer id;

    public SportFieldIdAlreadyExistsException(Integer id){
        super("La cancha con id: " + id + " Ya existe");
    }

    public Integer getId(){
        return this.id;
    }
}
