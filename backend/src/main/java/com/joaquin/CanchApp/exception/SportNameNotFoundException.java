package com.joaquin.CanchApp.exception;

public class SportNameNotFoundException extends Exception{
    private String name;

    public SportNameNotFoundException(String name){
        super("No se econtro el deporte: " + name);
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

}
