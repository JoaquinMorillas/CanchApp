package com.joaquin.CanchApp.exception;

public class AmenityNameNotFoundException extends Exception{

    private String name;

    public AmenityNameNotFoundException(String name){
        super(name);
        this.name = name;
    }

    public String getName(){
        return this.name;
    }


}
