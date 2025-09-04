package com.joaquin.CanchApp.exception;

public class AvailabilityIdNotFoundException extends Exception {
    private Integer id;

    public AvailabilityIdNotFoundException(Integer id){
        super("La disponibilidad con id: " + id + " No se ha encontrado");
    }

    public Integer getId(){
        return this.id;
    }

}
