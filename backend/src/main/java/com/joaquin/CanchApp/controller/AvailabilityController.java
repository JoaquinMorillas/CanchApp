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

import com.joaquin.CanchApp.dto.AvailabilityDTO;
import com.joaquin.CanchApp.exception.AvailabilityAlreadyExistsException;
import com.joaquin.CanchApp.exception.AvailabilityIdNotFoundException;
import com.joaquin.CanchApp.exception.BeginingTimeIsAfterEndingTimeException;
import com.joaquin.CanchApp.service.AvailabilityService;

@RestController
@RequestMapping("/availability")
public class AvailabilityController {
    @Autowired
    private AvailabilityService availabilityService;

    @PostMapping("/save")
    public ResponseEntity<AvailabilityDTO> save(@RequestBody AvailabilityDTO dto) throws AvailabilityAlreadyExistsException, BeginingTimeIsAfterEndingTimeException{
        AvailabilityDTO savedDto = availabilityService.save(dto);
        return ResponseEntity.ok(savedDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvailabilityDTO> findById(@PathVariable Integer id) throws AvailabilityIdNotFoundException{
        AvailabilityDTO dto = availabilityService.findById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/sportField/{id}")
    public ResponseEntity<List<AvailabilityDTO>> findBySportFieldId(@PathVariable Integer id){
        List<AvailabilityDTO> dtos = availabilityService.findBySportFieldId(id);
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AvailabilityDTO> updateAvailability(@PathVariable Integer id, @RequestBody AvailabilityDTO availabilityDTO) throws AvailabilityIdNotFoundException{
        AvailabilityDTO dto = availabilityService.updateAvailability(id, availabilityDTO);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAvailability(@PathVariable Integer id) throws AvailabilityIdNotFoundException{
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok("The availability with id: " + id + " has been deleted");
    }

}
