package com.kgdatasolutions.podcastbackend.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.kgdatasolutions.podcastbackend.Model.AppUser;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthReqResDto {

    private String error;
    private Auth_Status status;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String id;
    private String name;
    private String email;
    private Auth_Role role;
    private String password;
    private String newPassword;
    private String profileImage;
    private AppUser user;
    private String securityAnswer1;
    private String securityAnswer2;
    private String securityAnswer3;
    private String category;
    private String title;
    private String description;
}
