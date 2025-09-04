package com.joaquin.CanchApp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{

    Optional<User> findByEmail(String email);

    //@Query("Select u From User u where u.isActive=true")
    List<User> findByIsActiveTrue();

    List<User> findByRole(Role role);
}
