package com.joaquin.CanchApp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Amenity;

@Repository
public interface AmenityRespository extends JpaRepository<Amenity, Integer>{

    Optional<Amenity> findByName(String name);

}
