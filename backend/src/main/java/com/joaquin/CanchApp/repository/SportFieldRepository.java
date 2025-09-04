package com.joaquin.CanchApp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.SportField;
import java.util.List;


@Repository
public interface SportFieldRepository extends JpaRepository<SportField, Integer>{

    Optional<SportField> findByName(String name);

    Optional<SportField> findByStablishmentIdAndName(Integer stablishmentId, String name);

    List<SportField> findByStablishmentAddressCityContainingIgnoreCase(String city);

    List<SportField> findBySportAndStablishmentAddressCityContainingIgnoreCase(Sport sport, String city);

    List<SportField> findBySport(Sport sport);

    List<SportField> findByStablishmentId(Integer id);

    List<SportField> findByStablishmentIdAndSport(Integer id, Sport sport);
}
