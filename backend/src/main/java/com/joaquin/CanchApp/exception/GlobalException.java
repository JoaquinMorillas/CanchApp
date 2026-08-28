package com.joaquin.CanchApp.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.http.HttpStatus;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(EmailAlreadyExistsExcepction.class)
    public ResponseEntity<String> handleEmailAlreadyExisitException(EmailAlreadyExistsExcepction ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(IncorrectPasswordExcepion.class)
    public ResponseEntity<String> handleIncorrectPasswordExcepion(IncorrectPasswordExcepion ex){
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

    @ExceptionHandler(TokenIsExipiredException.class)
    public ResponseEntity<String> handleTokenIsExipiredException(TokenIsExipiredException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(InvalidEmailException.class)
    public ResponseEntity<String> handleInvalidEmailException(InvalidEmailException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(AmenityNameNotFoundException.class)
    public ResponseEntity<String> handleAmenityNameNotFoundException(AmenityNameNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(PolicyIdNotFoundException.class)
    public ResponseEntity<String> handlePolicyIdNotFoundException(PolicyIdNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(RatingMustHaveValueException.class)
    public ResponseEntity<String> handleRatingMustHaveValueException(RatingMustHaveValueException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(SportNameNotFoundException.class)
    public ResponseEntity<String> handleSportNameNotFoundException(SportNameNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ReservationIsAlreadyConfirmedException.class)
    public ResponseEntity<String> handleReservationIsAlreadyConfirmedException(ReservationIsAlreadyConfirmedException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());

    }
    @ExceptionHandler(ReservationUserIdIsDiferentFromTheIdSuppliedException.class)
    public ResponseEntity<String> handleReservationUserIdIsDiferentFromTheIdSuppliedException(ReservationUserIdIsDiferentFromTheIdSuppliedException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ReservationUserIsNullException.class)
    public ResponseEntity<String> handleReservationUserIsNullException(ReservationUserIsNullException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(ReservationDateIsBeforeCurrentDate.class)
    public ResponseEntity<String> handleReservationDateIsBeforeCurrentDate(ReservationDateIsBeforeCurrentDate ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
        public ResponseEntity<String> handleAuthorizationDenied(AuthorizationDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(UserIsNotTheOwnerException.class)
    public ResponseEntity<String> handleUserIsNotTheOwnerException(UserIsNotTheOwnerException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}