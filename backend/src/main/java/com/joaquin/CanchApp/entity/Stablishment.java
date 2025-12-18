package com.joaquin.CanchApp.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Stablishment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String description;
    private String telephoneNumber;

    @ElementCollection
    @CollectionTable(
        name = "stablishment_images", 
        joinColumns = @JoinColumn(name = "stablishment_id")
        )
    @Column(name = "image_url")
    private List<ImageInfo> images;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @OneToMany(mappedBy = "stablishment", cascade = CascadeType.ALL)
    private List<SportField> sportFields;

    @ManyToMany
    @JoinTable(
        name = "stablishment_amenity",
        joinColumns = @JoinColumn(name= "stablishment_id"),
        inverseJoinColumns = @JoinColumn(name= "amenity_id")
        )
    @Builder.Default
    private Set<Amenity> amenities = new HashSet<>();

    @ManyToMany(mappedBy = "favoritesStablishments")
    private Set<User> usersFavorites;

    @ManyToMany
    @JoinTable(
        name = "stablishment_policies",
        joinColumns = @JoinColumn(name = "stablishment_id"),
        inverseJoinColumns = @JoinColumn(name = "policy_id")
    )
    @Builder.Default
    private Set<Policy> policies = new HashSet<>();

    @OneToMany(mappedBy = "stablishment")
    @Builder.Default
    private List<Rating> ratings = new ArrayList<>();

    private Double AverageRating;
    private Integer numberOfRatings;
    private Integer sumOfRatings;

    
}
