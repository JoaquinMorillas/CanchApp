package com.joaquin.CanchApp.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.joaquin.CanchApp.entity.ImageInfo;
import com.joaquin.CanchApp.service.CloudinaryService;

@RestController
@RequestMapping("/images")
public class CloudinaryController {
    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<List<ImageInfo>> uploadImage(@RequestParam List<MultipartFile> files) {
        List<ImageInfo> images = new ArrayList<>();
        try{
            for(MultipartFile file : files) {
                ImageInfo image = cloudinaryService.uploadImg(file);
                images.add(image);
            }
            return ResponseEntity.ok(images);
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<String> deleteImage(@PathVariable String publicId) throws IOException{
        cloudinaryService.deleteImage(publicId);
        return ResponseEntity.ok("La imagen con id: " + publicId + " ha sido eliminada");
    }
}
