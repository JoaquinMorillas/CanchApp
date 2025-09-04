package com.joaquin.CanchApp.exception;

public class ReservationIdNotFoundException extends Exception{
    private Integer id;

    public ReservationIdNotFoundException(Integer id){
        super("La reserva con id: " + id + " No se ha encontrado");
    }

    public Integer getId() {
        return id;
    }

    

}
