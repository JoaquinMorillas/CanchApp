package com.joaquin.CanchApp.exception;


public class StablishmentIdNotFoundException extends Exception{
    private Integer id;

    public StablishmentIdNotFoundException(Integer id){
        super("El establecimiento con id: " + id + " no se ha encontrado");
    }

    public Integer getId(){
        return this.id;
    }
}
