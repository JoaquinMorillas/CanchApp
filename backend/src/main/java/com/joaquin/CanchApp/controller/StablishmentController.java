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
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.StablishmentCreationDTO;
import com.joaquin.CanchApp.dto.StablishmentDTO;
import com.joaquin.CanchApp.entity.Sport;

import com.joaquin.CanchApp.exception.AddressAlreadyExistsException;
import com.joaquin.CanchApp.exception.StablishmentIdNotFoundException;
import com.joaquin.CanchApp.exception.StablishmentNameAlreadyExistsException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.service.StablishmentService;

@RestController
@RequestMapping("/stablishment")
public class StablishmentController {

    @Autowired private StablishmentService stablishmentService;

    @PostMapping("/save")
    public ResponseEntity<StablishmentCreationDTO> save(@RequestBody StablishmentCreationDTO stablishmentCreationDTO) throws UserIdNotFoundException, AddressAlreadyExistsException, StablishmentNameAlreadyExistsException{
        StablishmentCreationDTO stablishment = stablishmentService.save(stablishmentCreationDTO);
        return ResponseEntity.ok(stablishment);
    }

    @GetMapping("/all")
    public ResponseEntity<List<StablishmentDTO>> findAll(){
        List<StablishmentDTO> stablishmentDTOs = stablishmentService.findAll();
        return ResponseEntity.ok(stablishmentDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StablishmentDTO> findById(@PathVariable Integer id) throws StablishmentIdNotFoundException{
        StablishmentDTO stablishmentDTO = stablishmentService.findById(id);
        return ResponseEntity.ok(stablishmentDTO);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<StablishmentDTO>> findByCity(@PathVariable String city){
        List<StablishmentDTO> stablishmentDTOs = stablishmentService.findByCity(city);
        return ResponseEntity.ok(stablishmentDTOs);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<StablishmentDTO>> findByOwnerID(@PathVariable Integer id) throws UserIdNotFoundException{
        List<StablishmentDTO> stablishmentDTOs = stablishmentService.findByOwnerID(id);
        return ResponseEntity.ok(stablishmentDTOs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) throws StablishmentIdNotFoundException{
        stablishmentService.deleteById(id);
        return ResponseEntity.ok().body("The stablishment with id: " + id + " has been deleted");
    }

    @GetMapping("sport/{sport}")
    public ResponseEntity<List<StablishmentDTO>> findBySports(@PathVariable Sport sport){
        List<StablishmentDTO> dtos = stablishmentService.findBySport(sport);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Boolean> findByName(@PathVariable String name) throws StablishmentNameAlreadyExistsException{
        Boolean response = stablishmentService.findByName(name);
        if (response) {
            throw new StablishmentNameAlreadyExistsException(name);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StablishmentDTO> updateStablishment(@RequestBody StablishmentDTO dto, @PathVariable Integer id) throws StablishmentIdNotFoundException{
        StablishmentDTO updateDto = stablishmentService.update(dto, id);
        return ResponseEntity.ok(updateDto);
    }
}
