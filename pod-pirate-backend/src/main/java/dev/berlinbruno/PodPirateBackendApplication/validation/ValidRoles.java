package dev.berlinbruno.PodPirateBackendApplication.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Custom annotation to validate roles.
 * Ensures that roles are not empty and only contain valid role values.
 */
@Documented
@Constraint(validatedBy = RolesValidator.class)  // Specifies the validator to use
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
// Specifies where the annotation can be applied
@Retention(RetentionPolicy.RUNTIME)  // Ensures the annotation is available at runtime for reflection
public @interface ValidRoles {

    /**
     * Default error message when validation fails.
     *
     * @return the default error message.
     */
    String message() default "Roles cannot be empty and must contain only valid role values";

    /**
     * Groups to apply validation to specific scenarios.
     *
     * @return the validation groups.
     */
    Class<?>[] groups() default {};

    /**
     * Provides additional data to the validation process.
     *
     * @return the payload.
     */
    Class<? extends Payload>[] payload() default {};
}
