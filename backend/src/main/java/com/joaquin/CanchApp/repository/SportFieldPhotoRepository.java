package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.SportFieldPhoto;

@Repository
public interface SportFieldPhotoRepository extends JpaRepository<SportFieldPhoto, Integer>{
    public List<SportFieldPhoto> findByStablishmentId(Integer id);

    public Optional<SportFieldPhoto> findByUrl(String url);
}
