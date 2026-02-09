package dev.berlinbruno.PodPirateBackendApplication.model;

import dev.berlinbruno.PodPirateBackendApplication.validation.ValidRoles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.Set;

@Data
@Document(collection = "app_user")
public class AppUser implements UserDetails {

    @Id
    private String id;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date lastModifiedAt;

    private Date lastLoginAt;

    @NotBlank(message = "Username should not be empty")
    @Size(min = 3, max = 20, message = "Username should be between 3 to 20 characters")
    @Pattern(
            regexp = "^(?:[a-z]*\\d){0,3}[a-z]*$",
            message = "Username can contain lowercase letters and up to 3 digits only"
    )
    private String username;

    @NotBlank(message = "Email should not be empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password should not be empty")
    private String password;

    @ValidRoles
    private Set<String> roles;

    @Size(max = 100, message = "Bio should not exceed 100 characters")
    private String bio;

    private String profileUrl;

    private boolean isLocked;

    private boolean isEmailVerified;

    public void lock() {
        this.isLocked = true;
    }

    public void unlock() {
        this.isLocked = false;
    }

    public void verifyEmail() {
        this.isEmailVerified = true;
    }

    public void unVerifyEmail() {
        this.isEmailVerified = false;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    public String getGenericUsername() {
        return username;
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
        return !isLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEmailVerified;
    }
}
