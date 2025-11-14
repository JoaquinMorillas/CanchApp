package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer>{
    Optional<Rating> findByUserIdAndStablishmentId(Integer userId, Integer stablishmentId);
    List<Rating> findByStablishmentId(Integer stablishmentId);
    List<Rating> findByUserId(Integer userId);
}
