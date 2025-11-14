package com.joaquin.CanchApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.RatingDTO;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.RatingMustHaveValueException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.service.RatingService;

@RestController
@RequestMapping("/rating")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/rate/{stablishmentId}")
    public ResponseEntity<RatingDTO> rateStablishment(
        @PathVariable Integer stablishmentId,
        @RequestBody RatingDTO dto,
        @AuthenticationPrincipal User user) 
        throws UserIdNotFoundException, StablishmentIdNotFoundException, RatingMustHaveValueException{

            RatingDTO rating = ratingService.rateStablishment(user.getId(), stablishmentId, dto.getValue(),dto.getOpinion());
            return ResponseEntity.ok(rating);
        }
    
}
