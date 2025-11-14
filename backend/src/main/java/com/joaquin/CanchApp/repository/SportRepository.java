package com.joaquin.CanchApp.repository;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Sport;

@Repository
public interface SportRepository extends JpaRepository<Sport, Integer> {
    Optional<Sport> findByName(String name);
    Set<Sport> findByCategoryContainingIgnoreCase(String category);
    

}
