package com.joaquin.CanchApp.controller;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.entity.Address;
import com.joaquin.CanchApp.exception.AddressAlreadyExistsException;
import com.joaquin.CanchApp.exception.AddressNotFoundException;
import com.joaquin.CanchApp.service.AddressService;

@RestController
@RequestMapping("/address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping("/all")
    public ResponseEntity<List<Address>> findAll(){
        List<Address> addressList = addressService.findAll();
        return ResponseEntity.ok(addressList);
    }

    @GetMapping("/cities") /* is used for the frontend to show all the availables cities */
    public ResponseEntity<List<String>> findAllcities(){
        List<String> allcities = addressService.findAllcities().stream()
        .map(a -> a.replace("_", " ").toLowerCase())/* returns the cities with a " " instaed of a "_" */
        .collect(Collectors.toList());
        
        return ResponseEntity.ok(allcities);
    }

    @GetMapping("/{city}")
    public ResponseEntity<List<Address>> findByCity(@PathVariable String city){
        List<Address> addressList = addressService.findByCity(city);
        return ResponseEntity.ok(addressList);
    }

    @PostMapping("/save")
    public ResponseEntity<Address> save(@RequestBody Address address) throws AddressAlreadyExistsException{
        Address savedAddress = addressService.save(address);
        return ResponseEntity.ok(savedAddress);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable Integer id) throws AddressNotFoundException{
        addressService.deleteAddress(id);
        return ResponseEntity.ok("The address with id: " + id + " was deleted");

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Integer id, @RequestBody Address newAddress) throws AddressNotFoundException, AddressAlreadyExistsException{
        
        Optional<Address> oldAddress = addressService.findById(id);
        Address addressToSave = oldAddress.get();

        if(newAddress.getCountry() != null) addressToSave.setCountry(newAddress.getCountry());
        if(newAddress.getProvince() != null) addressToSave.setProvince(newAddress.getProvince());
        if(newAddress.getCity() != null) addressToSave.setCity(newAddress.getCity());
        if(newAddress.getPostalCode() != null) addressToSave.setPostalCode(newAddress.getPostalCode());
        if(newAddress.getStreet() != null) addressToSave.setStreet(newAddress.getStreet());
        if(newAddress.getNumber() != null) addressToSave.setNumber(newAddress.getNumber());
        
        addressService.save(addressToSave);
        return ResponseEntity.ok(addressToSave);
        
    }

    @GetMapping("/exists/{country}/{city}/{street}/{number}") /* is used to check if an address already exists if true responds with a 400 */
    public ResponseEntity<Boolean> findByCountryAndCityAndStreetAndNumber(@PathVariable String country, @PathVariable String city, @PathVariable String street, @PathVariable String number) throws AddressAlreadyExistsException {
        Boolean exists = addressService.findByCountryAndCityAndStreetAndNumber(
            country.trim().toLowerCase(),
            city.trim().toLowerCase(),
            street.trim().toLowerCase(),
            number.trim().toLowerCase()
            );
        if(exists) {
            throw new AddressAlreadyExistsException("The Address Already Exists");
        } else{
            return ResponseEntity.ok(false);
        }

    }
}
