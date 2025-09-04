package com.joaquin.CanchApp.exception;

public class SportFieldIdNotFoundException extends Exception{
    private Integer id;

    public SportFieldIdNotFoundException(Integer id){
        super("La cancha con id: " + id +" No se ha encontrado");
    } 

    public Integer getInteger(){
        return this.id;
    }

}
