package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Stablishment;
import com.joaquin.CanchApp.entity.Sport;



@Repository
public interface StablishmentRepository extends JpaRepository<Stablishment, Integer>{

    
    List<Stablishment> findByAddressCityContainingIgnoreCaseAndIsActiveTrue(String city);
    
    Optional<Stablishment> findByNameAndIsActiveTrue(String name);

    List<Stablishment> findByOwnerIdAndIsActiveTrue(Integer id);

    List<Stablishment> findBySportFieldsSportAndIsActiveTrue(Sport sport);

    List<Stablishment> findByIsActiveTrue();

    List<Stablishment> findByIsActiveFalse();


}
