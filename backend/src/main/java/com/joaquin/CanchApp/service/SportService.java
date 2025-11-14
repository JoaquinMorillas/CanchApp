package com.joaquin.CanchApp.service;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.joaquin.CanchApp.entity.ImageInfo;
import com.joaquin.CanchApp.entity.Sport;
import com.joaquin.CanchApp.exception.SportNameNotFoundException;
import com.joaquin.CanchApp.repository.SportRepository;

@Service
public class SportService {

    @Autowired
    private SportRepository sportRepository;
    @Autowired
    private CloudinaryService cloudinaryService;

    public Sport saveSport(Sport sport) throws IOException{
        

        Sport newSport = Sport.builder()
                        .name(sport.getName())
                        .category(sport.getCategory())
                        .imgUrl(sport.getImgUrl())
                        .build();

        Sport savedSport = sportRepository.save(newSport);

        return savedSport;
    }

    public List<Sport> findAll(){
        return sportRepository.findAll(); 
    }

    public Sport findByName(String name) throws SportNameNotFoundException{
        Sport foundSport = sportRepository.findByName(name)
        .orElseThrow(() -> new SportNameNotFoundException(name));

        return foundSport;
    }

    public Set<Sport> findByCategory(String category){
        return sportRepository.findByCategoryContainingIgnoreCase(category);
    }

    public void deleteSport(Integer id){
        sportRepository.deleteById(id);
    }

    public Sport updateSport(Integer id, Sport updateSport) throws SportNameNotFoundException{
        Sport foundSport = sportRepository.findById(id)
        .orElseThrow(() -> new SportNameNotFoundException(updateSport.getName()));

        if(updateSport.getName() != null && !updateSport.getName().trim().isEmpty()){
            foundSport.setName(updateSport.getName());}
        
        if(updateSport.getCategory() != null && !updateSport.getCategory().trim().isEmpty()){
            foundSport.setCategory(updateSport.getCategory());}
        
        if(updateSport.getImgUrl() != null){
            foundSport.setImgUrl(updateSport.getImgUrl());}
        Sport savedSport = sportRepository.save(foundSport);

        return savedSport;

    }
}
