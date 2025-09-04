package com.joaquin.CanchApp.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class ImageInfo {
    private String imageUrl;
    private String publicId;

     public ImageInfo() {
    }
    
    public ImageInfo(String imageUrl, String publicId) {
        this.imageUrl = imageUrl;
        this.publicId = publicId;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public String getPublicId() {
        return publicId;
    }

    
}
