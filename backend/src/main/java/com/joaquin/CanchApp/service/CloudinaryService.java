package com.joaquin.CanchApp.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.joaquin.CanchApp.entity.ImageInfo;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.url}") String cloudinaryUrl) {
        this.cloudinary = new Cloudinary(cloudinaryUrl);
    }

    public ImageInfo uploadImg(MultipartFile file) throws IOException{
            @SuppressWarnings("rawtypes")
            Map upload = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = upload.get("secure_url").toString();
            String publicId = upload.get("public_id").toString();
            return new ImageInfo(imageUrl, publicId);
       
    }

    public void deleteImage(String publicId) throws IOException{
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

    }
}
