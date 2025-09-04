package com.joaquin.CanchApp.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(EmailAlreadyExistsExcepction.class)
    public ResponseEntity<String> handleEmailAlreadyExisitException(EmailAlreadyExistsExcepction ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(UserIdNotFoundException.class)
    public ResponseEntity<String> handlUserIdNotFoundException(UserIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    
    @ExceptionHandler(UserEmailNotFoundException.class)
    public ResponseEntity<String> handleUserEmailNotFoundException(UserEmailNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(AddressAlreadyExistsException.class)
    public ResponseEntity<String> handleAddressAlreadyExistsException(AddressAlreadyExistsException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(StablishmentNameAlreadyExistsException.class)
    public ResponseEntity<String> handleStablishmentNameAlreadyExistsException(StablishmentNameAlreadyExistsException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(StablishmentIdNotFoundException.class)
    public ResponseEntity<String> handleStablishmentIdNotFoundException(StablishmentIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(OwnerHasNoStablishmentsException.class)
    public ResponseEntity<String> handleOwnerHasNoStablishmentsException(OwnerHasNoStablishmentsException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(SportFieldNameAlreadyExistsException.class)
    public ResponseEntity<String> handleSportFieldNameAlreadyExistsException(SportFieldNameAlreadyExistsException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(SportFieldIdNotFoundException.class)
    public ResponseEntity<String> handleSportFieldIdNotFoundException(SportFieldIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(PhotoUrlAlreadyExists.class)
    public ResponseEntity<String> handlePhotoUrlAlreadyExists(PhotoUrlAlreadyExists ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(PhotoIdNotFoundException.class)
    public ResponseEntity<String> handlePhotoIdNotFoundException(PhotoIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(AvailabilityAlreadyExistsException.class)
    public ResponseEntity<String> handleAvailabilityAlreadyExistsException(AvailabilityAlreadyExistsException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(AvailabilityIdNotFoundException.class)
    public ResponseEntity<String> handleAvailabilityIdNotFoundException(AvailabilityIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(DurationLenghtDifferentFromExpected.class)
    public ResponseEntity<String> handleDurationLenghtDifferentFromExpected(DurationLenghtDifferentFromExpected ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ReservationBeginingHourNotAvailableException.class)
    public ResponseEntity<String> handleReservationBeginingHourNotAvailableException(ReservationBeginingHourNotAvailableException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ReservationIdNotFoundException.class)
    public ResponseEntity<String> handleReservationIdNotFoundException(ReservationIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(BeginingTimeIsAfterEndingTimeException.class)
    public ResponseEntity<String> handleBeginingTimeIsAfterEndingTimeException(BeginingTimeIsAfterEndingTimeException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}