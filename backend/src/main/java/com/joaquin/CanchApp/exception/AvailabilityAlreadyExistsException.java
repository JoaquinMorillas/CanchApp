package com.joaquin.CanchApp.exception;

import java.time.DayOfWeek;

public class AvailabilityAlreadyExistsException extends Exception{
    private DayOfWeek dayOfWeek;
    private Integer sportFieldId;

    public AvailabilityAlreadyExistsException(DayOfWeek dayOfWeek, Integer sportFieldId){
        super("La disponibilidad para la cancha con id: " + sportFieldId + 
        " para el día: " + dayOfWeek + " ya existe");
    }

    public DayOfWeek getDayOfWeek(){
        return this.dayOfWeek;
    }
    public Integer getSportFieldId(){
        return this.sportFieldId;
    }

}
