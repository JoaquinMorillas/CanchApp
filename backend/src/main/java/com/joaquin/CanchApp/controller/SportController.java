package com.joaquin.CanchApp.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.exception.SportNameNotFoundException;
import com.joaquin.CanchApp.service.SportService;

@RestController
@RequestMapping("/sport")
public class SportController {
    @Autowired
    private SportService sportService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
    public ResponseEntity<Sport> saveSport(@RequestBody Sport sport) throws IOException{
        Sport savedSport = sportService.saveSport(sport);

        return ResponseEntity.ok(savedSport);
    }

    @GetMapping("")
    public ResponseEntity<List<Sport>> findAll(){
        List<Sport> allSports = sportService.findAll();

        return ResponseEntity.ok(allSports);
    }
    
    @GetMapping("/{name}")
    public ResponseEntity<Sport> findByName(@PathVariable String name) throws SportNameNotFoundException{
        Sport foundSport = sportService.findByName(name);
        
        return ResponseEntity.ok(foundSport);
    }

    @GetMapping("/{category}")
    public ResponseEntity<Set<Sport>> findByCategory(@PathVariable String category){
        
        Set<Sport> foundSports = sportService.findByCategory(category);

        return ResponseEntity.ok(foundSports);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Sport> updateSport(@PathVariable Integer id, @RequestBody Sport sport) throws SportNameNotFoundException{
        Sport updatedSport = sportService.updateSport(id, sport);

        return ResponseEntity.ok(updatedSport);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSport(@PathVariable Integer id){
        sportService.deleteSport(id);
        return ResponseEntity.ok("El Deporte " + id +  " ha sido eliminado");
    }

}
