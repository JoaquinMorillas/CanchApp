package com.joaquin.CanchApp.exception;

public class PolicyIdNotFoundException extends Exception{
    private Integer id;

    public PolicyIdNotFoundException(Integer id){
        super("No se ha econtrado la politica con id: " + id);
    }

    public Integer getId(){
        return this.id;
    }

}
