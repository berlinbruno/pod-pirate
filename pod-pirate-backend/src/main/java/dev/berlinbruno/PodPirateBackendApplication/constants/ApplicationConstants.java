package dev.berlinbruno.PodPirateBackendApplication.constants;

import dev.berlinbruno.PodPirateBackendApplication.types.AccountRoles;

import java.util.Set;

public class ApplicationConstants {


    public static final Set<String> ROLES = Set.of(AccountRoles.ADMIN.name(), AccountRoles.USER.name());

}