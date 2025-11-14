package com.joaquin.CanchApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Policy;

@Repository
public interface PolicyRepository extends JpaRepository<Policy,Integer>{

}
