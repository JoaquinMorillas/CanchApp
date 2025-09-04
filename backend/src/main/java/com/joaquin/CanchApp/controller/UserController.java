package com.joaquin.CanchApp.controller;


import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.CanchApp.dto.UserDTO;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.EmailAlreadyExistsExcepction;
import com.joaquin.CanchApp.exception.UserEmailNotFoundException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.service.UserService;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    
    @PostMapping("/save")
    public ResponseEntity<UserDTO> saveUser(@RequestBody User user) throws EmailAlreadyExistsExcepction{
            UserDTO savedUser = userService.saveUser(user);
            return ResponseEntity.ok(savedUser);
        
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/all/active")
    public ResponseEntity<List<UserDTO>> getAllActive(){
        return ResponseEntity.ok(userService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer id) throws UserIdNotFoundException{
        UserDTO searchedUser = userService.findById(id);
        return ResponseEntity.ok(searchedUser);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) throws UserEmailNotFoundException{
        UserDTO searchedUser = userService.findByEmail(email);
        return ResponseEntity.ok(searchedUser);
    }

    @PatchMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) throws UserIdNotFoundException{
        userService.deleteUser(id);
        return ResponseEntity.ok("El usuario con id: " + id + " ha sido eliminado");
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO, @PathVariable Integer id) throws UserIdNotFoundException{

        UserDTO updatedUser = userService.updateUser(userDTO, id);
        return ResponseEntity.ok(updatedUser);
        
    }

    @GetMapping("/owners")
    public ResponseEntity<List<UserDTO>> findAllOwners(){
        List<UserDTO> owners = userService.findAllOwners();
        return ResponseEntity.ok(owners);
    }
}
