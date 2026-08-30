package com.joaquin.CanchApp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.SportField;
import java.util.List;


@Repository
public interface SportFieldRepository extends JpaRepository<SportField, Integer>{

    Optional<SportField> findByNameAndIsActiveTrue(String name);

    Optional<SportField> findByStablishmentIdAndNameAndIsActiveTrue(Integer stablishmentId, String name);

    List<SportField> findByIsActiveTrue();
    
    List<SportField> findByStablishmentAddressCityContainingIgnoreCaseAndIsActiveTrue(String city);

    List<SportField> findBySportNameAndStablishmentAddressCityContainingIgnoreCaseAndIsActiveTrue(String sport, String city);

    List<SportField> findBySportNameAndIsActiveTrue(String name);

    List<SportField> findByStablishmentIdAndIsActiveTrue(Integer id);

    List<SportField> findByStablishmentIdAndSportNameAndIsActiveTrue(Integer id, String sport);
}
