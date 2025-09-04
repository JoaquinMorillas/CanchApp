package com.joaquin.CanchApp.exception;

public class OwnerHasNoStablishmentsException extends Exception{
    private Integer id;

    public OwnerHasNoStablishmentsException(Integer id){
        super("El usuario con id: " + id + " no posee establicimientos");
    }

    public Integer getId(){
        return this.id;
    }

}
