package com.joaquin.CanchApp.exception;

public class AddressNotFoundException extends Exception{
    private Integer id;

    public AddressNotFoundException(Integer id){
        super("La dirección con id: " + id + "  No se encontro");
        this.id = id;
    }

    public Integer getId(){
        return this.id;
    }

}
