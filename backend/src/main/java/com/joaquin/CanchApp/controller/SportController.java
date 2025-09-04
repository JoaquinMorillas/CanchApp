package com.joaquin.CanchApp.controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.SportDTO;
import com.joaquin.CanchApp.entity.Sport;

@RestController
@RequestMapping("/sport")
public class SportController {

    @GetMapping("")
    public ResponseEntity<List<SportDTO>> getAllSports(){
        List<SportDTO> sportDTOs = Arrays.stream(Sport.values())
        .map(s -> new SportDTO(s.name(), s.name().replace("_", " ").toLowerCase()))
        .collect(Collectors.toList());
        
        return ResponseEntity.ok(sportDTOs);
    }
    
}
