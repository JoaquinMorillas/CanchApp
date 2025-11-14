package com.joaquin.CanchApp.service;


import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.RatingDTO;
import com.joaquin.CanchApp.entity.Rating;
import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.RatingMustHaveValueException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.mapper.RatingMapper;
import com.joaquin.CanchApp.repository.RatingRepository;
import com.joaquin.CanchApp.repository.StablishmentRepository;
import com.joaquin.CanchApp.repository.UserRepository;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StablishmentRepository stablishmentRepository;

    public RatingDTO rateStablishment(
        Integer userId, Integer stablishmentId, Integer value, String opinion) throws UserIdNotFoundException, StablishmentIdNotFoundException, RatingMustHaveValueException{

            if(value == null || !(value instanceof Integer) ){
                throw new RatingMustHaveValueException();
            }
            Rating ratingtoSave = ratingRepository.findByUserIdAndStablishmentId(userId, stablishmentId)
            .orElseGet(() -> new Rating());
            
            User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserIdNotFoundException(userId));

            Stablishment stablishment = stablishmentRepository.findById(stablishmentId)
            .orElseThrow(() -> new StablishmentIdNotFoundException(stablishmentId));

            ratingtoSave.setStablishment(stablishment);
            ratingtoSave.setUser(user);
            ratingtoSave.setValue(value);
            ratingtoSave.setOpinion(opinion);
            ratingtoSave.setCreatedAt(LocalDate.now());
            
            Rating savedRating = ratingRepository.save(ratingtoSave);

            updateStablishmentRating(stablishment.getId());
            
            return RatingMapper.toDto(savedRating);
        }

    private void updateStablishmentRating(Integer stablishmentId) throws StablishmentIdNotFoundException {
        Stablishment stablishment = stablishmentRepository.findById(stablishmentId)
        .orElseThrow(() -> new StablishmentIdNotFoundException(stablishmentId));

        List<Rating> stablishmentsRatings = ratingRepository.findByStablishmentId(stablishmentId);

        Integer numberOfRatings = stablishmentsRatings.size();
        
        Integer sumOfRatings = stablishmentsRatings.stream()
                            
                            .mapToInt(Rating::getValue)
                            .filter(Objects::nonNull)
                            .sum();

        Double averageRating = stablishmentsRatings.stream()
                                .filter(Objects::nonNull)
                                .mapToInt(Rating::getValue)
                                .filter(Objects::nonNull)
                                .average()
                                .orElse(0.0);

        stablishment.setNumberOfRatings(numberOfRatings);
        stablishment.setSumOfRatings(sumOfRatings);
        stablishment.setAverageRating(averageRating);

        stablishmentRepository.save(stablishment);
        
    }   
}
