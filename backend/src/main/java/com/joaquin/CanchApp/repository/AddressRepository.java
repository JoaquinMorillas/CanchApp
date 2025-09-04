package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    
    List<Address> findByCity(String city);

    Optional<Address> findByCountryAndCityAndStreetAndNumberIgnoreCase(
        String country,
        String city,
        String street,
        String number
    );

    
}
