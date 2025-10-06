package com.joaquin.CanchApp.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.joaquin.CanchApp.dto.AmenityDTO;
import com.joaquin.CanchApp.exception.AmenityNameNotFoundException;
import com.joaquin.CanchApp.service.AmenityService;

@RestController
@RequestMapping("/amenity")
public class AmenityController {

    @Autowired
    private AmenityService amenityService;

    @GetMapping("/all")
    public ResponseEntity<List<AmenityDTO>> findAll(){
        List<AmenityDTO> dtos = amenityService.findAll();
        return ResponseEntity.ok(dtos);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<AmenityDTO> save(
        @RequestParam("name") String name,
        @RequestParam("icon") MultipartFile file
    ) throws IOException{
        AmenityDTO dto = amenityService.save(name, file);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteByName(@PathVariable String name) throws AmenityNameNotFoundException{
        amenityService.deleteByName(name);
        return ResponseEntity.ok("La caracteristica " + name + " ha sido eliminada");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update")
    public ResponseEntity<AmenityDTO> update(
        @RequestBody AmenityDTO oldDto,
        @RequestBody AmenityDTO updatedDto
    ) throws AmenityNameNotFoundException{
        
        AmenityDTO newDto = amenityService.update(oldDto, updatedDto);
        return ResponseEntity.ok(newDto);
    }
}
