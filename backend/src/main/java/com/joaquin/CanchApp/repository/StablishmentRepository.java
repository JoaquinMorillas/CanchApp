package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.entity.Sport;



@Repository
public interface StablishmentRepository extends JpaRepository<Stablishment, Integer>{

    
    List<Stablishment> findByAddressCityContainingIgnoreCase(String city);
    
    Optional<Stablishment> findByName(String name);

    List<Stablishment> findByOwnerId(Integer id);

    List<Stablishment> findBySportFieldsSport(Sport sport);

}
