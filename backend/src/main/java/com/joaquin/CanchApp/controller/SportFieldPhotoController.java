package com.joaquin.CanchApp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.SportFieldPhotoDTO;
import com.joaquin.CanchApp.exception.PhotoIdNotFoundException;
import com.joaquin.CanchApp.exception.PhotoUrlAlreadyExists;
import com.joaquin.CanchApp.exception.SportFieldIdNotFoundException;
import com.joaquin.CanchApp.service.SportFieldPhotoService;

@RestController
@RequestMapping("/photo")
public class SportFieldPhotoController {
    @Autowired
    private SportFieldPhotoService sportFieldPhotoService;

    @PostMapping("/save")
    public ResponseEntity<SportFieldPhotoDTO> save(@RequestBody SportFieldPhotoDTO sportFieldPhotoDTO) throws SportFieldIdNotFoundException, PhotoUrlAlreadyExists{
        SportFieldPhotoDTO savedPhoto = sportFieldPhotoService.save(sportFieldPhotoDTO);
        return ResponseEntity.ok(savedPhoto);
        
    }

    @GetMapping("stablishment/{id}")
    public ResponseEntity<List<SportFieldPhotoDTO>> findByStablishmentId(@PathVariable Integer id){
        List<SportFieldPhotoDTO> dtos = sportFieldPhotoService.findByStablishmentId(id);
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) throws PhotoIdNotFoundException{
        sportFieldPhotoService.deleteById(id);
        return ResponseEntity.ok("The photo with id: " + id + " has been deleted");
    }

}
