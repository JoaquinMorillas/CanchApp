package com.joaquin.CanchApp.exception;

public class PhotoIdNotFoundException extends Exception{
    private Integer id;

    public PhotoIdNotFoundException(Integer id){
        super("La imagen con id: " + id + " no se ha encontrado");
    }

    public Integer getId(){
        return this.id;
    }

}
