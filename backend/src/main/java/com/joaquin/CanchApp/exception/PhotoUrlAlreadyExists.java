package com.joaquin.CanchApp.exception;

public class PhotoUrlAlreadyExists extends Exception {
    private String url;

    public PhotoUrlAlreadyExists(String url){
        super("La url: " + url + " ya existe");
    }

    public String getUrl(){
        return this.url;
    }

}
