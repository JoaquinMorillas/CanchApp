package com.joaquin.CanchApp.exception;


public class UserIdNotFoundException extends Exception{
    private Integer id;

    public UserIdNotFoundException(Integer id){
        super("El usuario con id: " + id.toString() + " no se ha encontrado");
        this.id = id;
    }

    public Integer id(){
        return this.id;
    }
}
