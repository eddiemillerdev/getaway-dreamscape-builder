
import { sanitizeInput, sanitizeEmail, sanitizePhone, validateEmail, validatePassword, validateRequired } from './security';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
}

export class FormValidator {
  private errors: Record<string, string> = {};
  private sanitizedData: Record<string, any> = {};

  validateField(
    fieldName: string,
    value: any,
    rules: {
      required?: boolean;
      type?: 'email' | 'phone' | 'password' | 'text';
      minLength?: number;
      maxLength?: number;
      custom?: (value: any) => string | null;
    }
  ): this {
    let sanitizedValue = value;

    // Sanitize based on type
    if (typeof value === 'string') {
      switch (rules.type) {
        case 'email':
          sanitizedValue = sanitizeEmail(value);
          break;
        case 'phone':
          sanitizedValue = sanitizePhone(value);
          break;
        default:
          sanitizedValue = sanitizeInput(value);
          break;
      }
    }

    this.sanitizedData[fieldName] = sanitizedValue;

    // Required validation
    if (rules.required) {
      const requiredError = validateRequired(sanitizedValue, fieldName);
      if (requiredError) {
        this.errors[fieldName] = requiredError;
        return this;
      }
    }

    // Skip other validations if field is empty and not required
    if (!sanitizedValue && !rules.required) {
      return this;
    }

    // Type-specific validation
    switch (rules.type) {
      case 'email':
        const emailError = validateEmail(sanitizedValue);
        if (emailError) this.errors[fieldName] = emailError;
        break;
      case 'password':
        const passwordError = validatePassword(sanitizedValue);
        if (passwordError) this.errors[fieldName] = passwordError;
        break;
    }

    // Length validation
    if (rules.minLength && sanitizedValue.length < rules.minLength) {
      this.errors[fieldName] = `${fieldName} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      this.errors[fieldName] = `${fieldName} must not exceed ${rules.maxLength} characters`;
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(sanitizedValue);
      if (customError) this.errors[fieldName] = customError;
    }

    return this;
  }

  getResult(): ValidationResult {
    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: { ...this.errors },
      sanitizedData: { ...this.sanitizedData }
    };
  }

  reset(): this {
    this.errors = {};
    this.sanitizedData = {};
    return this;
  }
}

export const createValidator = () => new FormValidator();
