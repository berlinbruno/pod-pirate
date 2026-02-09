package dev.berlinbruno.PodPirateBackendApplication.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Set;

import static dev.berlinbruno.PodPirateBackendApplication.constants.ApplicationConstants.ROLES;

/**
 * Validator for checking if the provided roles are valid.
 * Validates that each role in the list is part of the predefined set of valid roles.
 */
public class RolesValidator implements ConstraintValidator<ValidRoles, Set<String>> {

    /**
     * Validates that each role in the provided list is part of the valid roles.
     *
     * @param roles   the list of roles to validate
     * @param context the context in which the validation is executed
     * @return true if all roles are valid, false otherwise
     */
    @Override
    public boolean isValid(Set<String> roles, ConstraintValidatorContext context) {
        // Check if the list is null or empty
        if (roles == null || roles.isEmpty()) {
            return false;  // Return false if roles are missing or empty
        }

        // Validate each role against the allowed roles
        for (String role : roles) {
            if (!ROLES.contains(role)) {
                return false;  // Return false if any role is invalid
            }
        }

        return true;  // All roles are valid
    }
}
