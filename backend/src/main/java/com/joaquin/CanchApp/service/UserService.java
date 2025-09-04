package com.joaquin.CanchApp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joaquin.CanchApp.dto.UserDTO;
import com.joaquin.CanchApp.entity.Role;
import com.joaquin.CanchApp.entity.User;
import com.joaquin.CanchApp.exception.EmailAlreadyExistsExcepction;
import com.joaquin.CanchApp.exception.UserEmailNotFoundException;
import com.joaquin.CanchApp.exception.UserIdNotFoundException;
import com.joaquin.CanchApp.mapper.UserMapper;
import com.joaquin.CanchApp.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDTO saveUser(User user) throws EmailAlreadyExistsExcepction{
        Optional<User> searchedUser = userRepository.findByEmail(user.getEmail());

        if(searchedUser.isPresent()){
            throw new EmailAlreadyExistsExcepction(searchedUser.get().getEmail());
        }
        else{

            User savedUser = userRepository.save(user);
            return UserMapper.toDTO(savedUser);
        }

    }

    public UserDTO findById(Integer id) throws UserIdNotFoundException{
        Optional<User> searchedUser = userRepository.findById(id);
        if (searchedUser.isPresent()){
            return UserMapper.toDTO(searchedUser.get());
        }else{
            throw new UserIdNotFoundException(id);
        }
    }

    public UserDTO findFullUserById(Integer id) throws UserIdNotFoundException{
        Optional<User> searchedUser = userRepository.findById(id);
        if (searchedUser.isPresent()){
            return UserMapper.toDTO(searchedUser.get());
        }else{
            throw new UserIdNotFoundException(id);
        }
    }

    public List<UserDTO> findAll(){
        List<User> users = userRepository.findAll();
        List<UserDTO> dtos = users.stream()
        .map(UserMapper::toDTO)
        .collect(Collectors.toList());
        return dtos;
    }

    public List<UserDTO> findAllActive(){
        List<User> users = userRepository.findByIsActiveTrue();
        List<UserDTO> dtos = users.stream()
        .map(UserMapper::toDTO)
        .collect(Collectors.toList());
        return dtos;
    }   

    public UserDTO findByEmail(String email) throws UserEmailNotFoundException{
        Optional<User> searchedUSer = userRepository.findByEmail(email);

        if(searchedUSer.isPresent()){
            return UserMapper.toDTO(searchedUSer.get());
        } else{
            throw new UserEmailNotFoundException(email);
        }
    }
    
    //The user is not deleted from the DB it's isActive atribute is set to false
    public void deleteUser(Integer id) throws UserIdNotFoundException{
        Optional<User> searchedUser = userRepository.findById(id);
        if(searchedUser.isPresent()){
            User toSaveUSer = searchedUser.get();
            toSaveUSer.setIsActive(false);
            userRepository.save(toSaveUSer);
        }else{
            throw new UserIdNotFoundException(id);
        }
    }

    public UserDTO updateUser(UserDTO userDto, Integer id) throws UserIdNotFoundException{
        
        User userToUpdate = userRepository.findById(id)
        .orElseThrow(()-> new UserIdNotFoundException(id));

        if (userDto.getName() != null) userToUpdate.setFirstName(userDto.getName());
        if (userDto.getLastName() != null) userToUpdate.setLastName(userDto.getLastName());
        if (userDto.getEmail() != null) userToUpdate.setEmail(userDto.getEmail());
        if (userDto.getRole() != null) userToUpdate.setRole(userDto.getRole());
        
        userRepository.save(userToUpdate);
        return UserMapper.toDTO(userToUpdate);
    }

    public List<UserDTO> findAllOwners(){
        List<User> owners = userRepository.findByRole(Role.OWNER);
        List<UserDTO> dtos = owners.stream()
        .map(UserMapper::toDTO)
        .collect(Collectors.toList());
        return dtos;
    }
}
