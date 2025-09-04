package com.joaquin.CanchApp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.entity.Address;
import com.joaquin.CanchApp.exception.AddressAlreadyExistsException;
import com.joaquin.CanchApp.exception.AddressNotFoundException;
import com.joaquin.CanchApp.repository.AddressRepository;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public Address save(Address address) throws AddressAlreadyExistsException{
        Optional<Address> addressToSearch = addressRepository.findByCountryAndCityAndStreetAndNumberIgnoreCase(
            address.getCountry().trim().toLowerCase(),
            address.getCity().trim().toLowerCase(),
            address.getStreet().trim().toLowerCase(),
            address.getNumber().trim().toLowerCase()
            );
        if(addressToSearch.isPresent() && !addressToSearch.get().getId().equals(address.getId())){
            throw new AddressAlreadyExistsException("La dirección ingresada ya existe.");
        }else{
            address.setCountry(address.getCountry().trim().toLowerCase());
            address.setCity(address.getCity().trim().toLowerCase());
            address.setProvince(address.getProvince().trim().toLowerCase());
            address.setPostalCode(address.getPostalCode().trim().toLowerCase());
            address.setStreet(address.getStreet().trim().toLowerCase());
            address.setNumber(address.getNumber().trim().toLowerCase());
            return addressRepository.save(address);
        }
        
    }

    public List<Address> findAll(){
        return addressRepository.findAll();
    }

    public List<Address> findByCity(String city){
        return addressRepository.findByCity(city);
    }

    public void deleteAddress(Integer id) throws AddressNotFoundException{
        Optional<Address> addressToDelete = addressRepository.findById(id);
        if(addressToDelete.isPresent()){
            addressRepository.deleteById(id);
        }else{
            throw new AddressNotFoundException(id);
        }
    }

    public Optional<Address> findById(Integer id) throws AddressNotFoundException{
        Optional<Address> searchedAddress = addressRepository.findById(id);
        if (searchedAddress.isPresent()){
            return searchedAddress;
        }else{
            throw new AddressNotFoundException(id);
        }
    }

    public List<String> findAllcities(){
        List<Address> allAddresses = addressRepository.findAll();
        List<String> allcities = new ArrayList<>();


        for(Address address : allAddresses){

            if(!allcities.contains(address.getCity()))
            allcities.add(address.getCity());
        }

        return allcities;
    }

    public Boolean findByCountryAndCityAndStreetAndNumber(String country, String city, String street, String number) {
        Optional<Address> searchedAddress = addressRepository.findByCountryAndCityAndStreetAndNumberIgnoreCase(
            country.trim().toLowerCase(),
            city.trim().toLowerCase(),
            street.trim().toLowerCase(),
            number.trim().toLowerCase()
            );
        if (searchedAddress.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

     public Address saveAndFlush(Address address) throws AddressAlreadyExistsException {
        Optional<Address> existing = addressRepository.findByCountryAndCityAndStreetAndNumberIgnoreCase(
            address.getCountry().trim().toLowerCase(),
            address.getCity().trim().toLowerCase(),
            address.getStreet().trim().toLowerCase(),
            address.getNumber().trim().toLowerCase()
        );

        if(existing.isPresent()) {
            throw new AddressAlreadyExistsException("The Address Already Exists");
        }

        address.setCountry(address.getCountry().trim().toLowerCase());
        address.setCity(address.getCity().trim().toLowerCase());
        address.setProvince(address.getProvince().trim().toLowerCase());
        address.setPostalCode(address.getPostalCode().trim().toLowerCase());
        address.setStreet(address.getStreet().trim().toLowerCase());
        address.setNumber(address.getNumber().trim().toLowerCase());

        return addressRepository.saveAndFlush(address);  // <-- call repository directly
    }


}