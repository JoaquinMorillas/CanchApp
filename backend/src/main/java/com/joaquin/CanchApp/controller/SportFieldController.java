package com.joaquin.CanchApp.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.SportFieldDTO;
import com.joaquin.CanchApp.dto.SportFieldUpdateDTO;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.entity.SportField;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.exception.SportFieldNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.service.SportFieldService;


@RestController
@RequestMapping("/sport_field")
public class SportFieldController {

    @Autowired
    private SportFieldService sportFieldService;

    @PostMapping("/save")
    public ResponseEntity<SportFieldDTO> save(@RequestBody SportFieldDTO sportFieldCreationDTO) throws SportFieldNameAlreadyExistsException{
        SportFieldDTO savedSportFieldCreationDTO = sportFieldService.save(sportFieldCreationDTO);
        return ResponseEntity.ok(savedSportFieldCreationDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SportFieldDTO>> findAll(){
        List<SportFieldDTO> sportFieldCreationDTOs = sportFieldService.findAll();
        return ResponseEntity.ok(sportFieldCreationDTOs);
    }

    @GetMapping("/all_complete")
    public ResponseEntity<List<SportField>> findAllComplete(){
        List<SportField> sportFields = sportFieldService.findAllComplete();
        return ResponseEntity.ok(sportFields);
    }

    @GetMapping("find")
    public ResponseEntity<List<SportFieldDTO>> findByFilters(  
        @RequestParam(required = false) String city,
        @RequestParam(required = false) String sport
        ){
            List<SportFieldDTO> sportFieldCreationDTOs = null;

        if (city != null && sport != null){
            sportFieldCreationDTOs = sportFieldService.findBySportAndCity(sport, city);
        }else if(city != null){
            sportFieldCreationDTOs = sportFieldService.findByCity(city);
        }else if(sport != null){
            sportFieldCreationDTOs = sportFieldService.findBySport(sport);
        }else{
            sportFieldCreationDTOs = sportFieldService.findAll();
        }

        return ResponseEntity.ok(sportFieldCreationDTOs);
    }

    @GetMapping("/stablishment/{id}")
    public ResponseEntity<List<SportFieldDTO>> findByStablishmentId(@PathVariable Integer id){
        List<SportFieldDTO> sportFieldCreationDTOs = sportFieldService.findbyStablismentId(id);
        return ResponseEntity.ok(sportFieldCreationDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SportFieldDTO> findById(@PathVariable Integer id) throws SportFieldIdNotFoundException{
        SportFieldDTO sportFieldCreationDTO = sportFieldService.findById(id);
        return ResponseEntity.ok(sportFieldCreationDTO);
    }

    @PutMapping("update/{id}")
    public ResponseEntity<SportFieldUpdateDTO> update(@PathVariable Integer id, @RequestBody SportFieldUpdateDTO sportFieldUpdateDTO) throws SportFieldIdNotFoundException{
        SportFieldUpdateDTO UpdateDTO = sportFieldService.update(sportFieldUpdateDTO, id);
         return ResponseEntity.ok(UpdateDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) throws SportFieldIdNotFoundException{
        sportFieldService.deleteById(id);
        return ResponseEntity.ok("The sportField with id: " + id + " has been deleted");
    }

    @GetMapping("/stablishment_id/{id}/{name}")
    public ResponseEntity<Boolean> findByStablishmentIdAndName(@PathVariable Integer id, @PathVariable String name) throws SportFieldNameAlreadyExistsException{
        Boolean response = sportFieldService.findByNameAndStablishmentId(name, id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stablishment/{id}/{sport}")
    public ResponseEntity<List<SportFieldDTO>> findByStablishmentIdAndSport(@PathVariable Integer id, @PathVariable Sport sport) throws StablishmentIdNotFoundException{
        List<SportFieldDTO> dtos = sportFieldService.findByStablishmentIdAndSport(id, sport);
        return ResponseEntity.ok(dtos);
        
    }
}
