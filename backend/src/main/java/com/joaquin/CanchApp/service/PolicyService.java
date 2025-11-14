package com.joaquin.CanchApp.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.PolicyDTO;
import com.joaquin.CanchApp.entity.Policy;
import com.joaquin.CanchApp.exception.PolicyIdNotFoundException;
import com.joaquin.CanchApp.mapper.PolicyMapper;
import com.joaquin.CanchApp.repository.PolicyRepository;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    public List<PolicyDTO> findAll(){
        List<Policy> allPolicies = policyRepository.findAll();

        List<PolicyDTO> dtos;
       
        dtos = allPolicies.stream()
                .map(PolicyMapper::toDTO)
                .collect(Collectors.toList());

        return dtos;
    }

    public PolicyDTO findById(Integer id) throws PolicyIdNotFoundException{
        Policy founPolicy = policyRepository.findById(id)
        .orElseThrow(() -> new PolicyIdNotFoundException(id));

        return PolicyMapper.toDTO(founPolicy);
    }

    public PolicyDTO savePolicy(PolicyDTO policyDTO){
        Policy policyToSave = Policy.builder()
        .title(policyDTO.getTitle())
        .description(policyDTO.getDescription())
        .build();
        Policy savedPolicy = policyRepository.save(policyToSave);
        return PolicyMapper.toDTO(savedPolicy);
    }

    public void deletePolicy(Integer id) throws PolicyIdNotFoundException{
        Policy foundPolicy = policyRepository.findById(id)
        .orElseThrow(() -> new PolicyIdNotFoundException(id));

        policyRepository.deleteById(foundPolicy.getId());
    }

    public PolicyDTO updatePolicy(Integer id, PolicyDTO policyToUpdate) throws PolicyIdNotFoundException{
        Policy foundPolicy = policyRepository.findById(id)
        .orElseThrow(() -> new PolicyIdNotFoundException(policyToUpdate.getId()));

        if(policyToUpdate.getDescription() != null){foundPolicy.setDescription(policyToUpdate.getDescription());}
        if(policyToUpdate.getTitle() != null){foundPolicy.setTitle(policyToUpdate.getTitle());}

        Policy savedPolicy = policyRepository.save(foundPolicy);

        return PolicyMapper.toDTO(savedPolicy);
    }
}
