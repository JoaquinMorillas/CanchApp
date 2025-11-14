package com.joaquin.CanchApp.controller;

import java.util.List;

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

import com.joaquin.CanchApp.dto.PolicyDTO;
import com.joaquin.CanchApp.exception.PolicyIdNotFoundException;
import com.joaquin.CanchApp.service.PolicyService;

@RestController
@RequestMapping("/policy")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @GetMapping("/all")
    public ResponseEntity<List<PolicyDTO>> findAll(){
        List<PolicyDTO> allPolicies = policyService.findAll();
        return ResponseEntity.ok(allPolicies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PolicyDTO> findById(@PathVariable Integer id) throws PolicyIdNotFoundException{
        PolicyDTO dto = policyService.findById(id);

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @PostMapping("/save")
    public ResponseEntity<PolicyDTO> save(@RequestBody PolicyDTO policyDTO){
        PolicyDTO savedPolicy = policyService.savePolicy(policyDTO);
        return ResponseEntity.ok(savedPolicy);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Integer id) throws PolicyIdNotFoundException{
        policyService.deletePolicy(id);
        return ResponseEntity.ok("La politica con id: " + id +" ha sido eliminada correctamente");
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('OWNER')")
    @PutMapping("/update/{id}")
    public ResponseEntity<PolicyDTO> updatePolicy(
        @PathVariable Integer id,
        @RequestBody PolicyDTO policyToUpdate) throws PolicyIdNotFoundException{
            PolicyDTO updatedPolicy = policyService.updatePolicy(id, policyToUpdate);
            return ResponseEntity.ok(updatedPolicy);
        }

}
