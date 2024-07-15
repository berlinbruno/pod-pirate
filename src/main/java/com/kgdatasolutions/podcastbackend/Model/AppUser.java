package com.kgdatasolutions.podcastbackend.Model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "app_user")
public class AppUser implements UserDetails {

    @Id
    private String id;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date lastModifiedAt;

    @Size(min = 3, max = 20, message = "Name should be between 3 to 20 character length")
    @Pattern(regexp = "^[a-zA-Z ]{3,20}$", message = "Name should contain only alphabetic characters")
    private String name;

    @NotBlank(message = "Email should not be empty")
    private String email;

    @NotBlank(message = "Password should not be empty")
    private String password;

    @Pattern(regexp = "^(USER|ADMIN)$", message = "Role must be either 'USER' or 'ADMIN'")
    private String role;

    @NotBlank(message = "securityAnswer1 should not be empty")
    private String securityAnswer1;

    @NotBlank(message = "securityAnswer2 should not be empty")
    private String securityAnswer2;

    @NotBlank(message = "securityAnswer3 should not be empty")
    private String securityAnswer3;

    private String profileUrl;
    private String bannerUrl;

    @NotBlank(message = "Category should not be empty")
    private String category;

    @NotBlank(message = "Title should not be empty")
    private String title;

    @NotBlank(message = "Description should not be empty")
    private String description;
    private List<Episode> episodes;

    @Setter
    @Getter
    private boolean locked;

    // Implement lock and unlock methods
    public void lock() {
        this.locked = true;
    }

    public void unlock() {
        this.locked = false;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

