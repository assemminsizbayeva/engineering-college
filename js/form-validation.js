// Form Validation for Engineering College Website

document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
});

function initializeFormValidation() {
    // Registration Form Validation
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        setupRegistrationForm(registrationForm);
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        setupContactForm(contactForm);
    }
}

// Registration Form Setup
function setupRegistrationForm(form) {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');

    // Real-time validation
    if (password) {
        password.addEventListener('input', validatePasswordStrength);
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }

    if (phone) {
        phone.addEventListener('input', formatPhoneNumber);
        phone.addEventListener('blur', validatePhoneNumber);
    }

    if (email) {
        email.addEventListener('blur', validateEmail);
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateRegistrationForm(form)) {
            submitRegistrationForm(form);
        }
    });

    // Real-time validation for required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Contact Form Setup
function setupContactForm(form) {
    // Anti-spam honeypot
    const honeypot = form.querySelector('#website');
    if (honeypot) {
        honeypot.style.display = 'none';
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check honeypot
        if (honeypot && honeypot.value !== '') {
            showFormMessage('Sorry, there was an error with your submission.', 'danger');
            return;
        }

        if (validateContactForm(form)) {
            submitContactForm(form);
        }
    });

    // Real-time validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Registration Form Validation
function validateRegistrationForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');

    // Validate all required fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate password match
    if (!validatePasswordMatch()) {
        isValid = false;
    }

    // Validate terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (agreeTerms && !agreeTerms.checked) {
        showValidationFeedback(agreeTerms, false);
        isValid = false;
    }

    return isValid;
}

// Contact Form Validation
function validateContactForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Individual Field Validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.type) {
        case 'email':
            isValid = validateEmailFormat(value);
            message = isValid ? '' : 'Please enter a valid email address.';
            break;
        case 'tel':
            isValid = validatePhoneFormat(value);
            message = isValid ? '' : 'Please enter a valid phone number.';
            break;
        case 'password':
            if (field.id === 'password') {
                isValid = value.length >= 8;
                message = isValid ? '' : 'Password must be at least 8 characters long.';
            }
            break;
        default:
            if (field.required) {
                isValid = value !== '';
                message = isValid ? '' : 'This field is required.';
            }
    }

    // Special validation for specific fields
    if (field.id === 'confirmPassword') {
        isValid = validatePasswordMatch();
        message = isValid ? '' : 'Passwords do not match.';
    }

    if (field.type === 'checkbox' && field.required) {
        isValid = field.checked;
        message = isValid ? '' : 'This field is required.';
    }

    showValidationFeedback(field, isValid, message);
    return isValid;
}

// Email Validation
function validateEmail() {
    const field = this;
    const value = field.value.trim();
    const isValid = validateEmailFormat(value);
    showValidationFeedback(field, isValid, isValid ? '' : 'Please enter a valid email address.');
}

function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Number Validation
function validatePhoneNumber() {
    const field = this;
    const value = field.value.trim();
    const isValid = validatePhoneFormat(value);
    showValidationFeedback(field, isValid, isValid ? '' : 'Please enter a valid phone number.');
}

function validatePhoneFormat(phone) {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = phone.replace(/[^\d+]/g, '');
    return phoneRegex.test(cleaned) && cleaned.length >= 10;
}

function formatPhoneNumber() {
    const field = this;
    let value = field.value.replace(/[^\d]/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    
    field.value = value;
}

// Password Validation
function validatePasswordStrength() {
    const password = this.value;
    const strengthBar = document.querySelector('#passwordStrength .progress-bar');
    const strengthText = document.querySelector('.password-strength-text');
    
    let strength = 0;
    let messages = [];
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Number/Special char check
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    
    // Update progress bar
    if (strengthBar) {
        strengthBar.style.width = strength + '%';
        
        // Update color based on strength
        if (strength < 50) {
            strengthBar.className = 'progress-bar bg-danger';
            strengthText.textContent = 'Weak password';
        } else if (strength < 75) {
            strengthBar.className = 'progress-bar bg-warning';
            strengthText.textContent = 'Medium password';
        } else {
            strengthBar.className = 'progress-bar bg-success';
            strengthText.textContent = 'Strong password';
        }
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (!password || !confirmPassword) return true;
    
    const isValid = password.value === confirmPassword.value && password.value !== '';
    showValidationFeedback(confirmPassword, isValid, isValid ? '' : 'Passwords do not match.');
    return isValid;
}

// Form Submission
function submitRegistrationForm(form) {
    // Simulate form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate reference number
        const referenceNumber = 'EC' + Date.now().toString().slice(-8);
        document.getElementById('referenceNumber').textContent = referenceNumber;
        
        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset password strength indicator
        const strengthBar = document.querySelector('#passwordStrength .progress-bar');
        if (strengthBar) {
            strengthBar.style.width = '0%';
            strengthBar.className = 'progress-bar';
        }
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
    }, 2000);
}

function submitContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    const formMessage = document.getElementById('formMessage');
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showFormMessage('Thank you for your message! We will get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
    }, 1500);
}

// Utility Functions
function showValidationFeedback(element, isValid, message = '') {
    if (isValid) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    } else {
        element.classList.remove('is-valid');
        element.classList.add('is-invalid');
    }
    
    // Update feedback message
    const feedback = element.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
    }
}

function showFormMessage(message, type = 'info') {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = formMessage.querySelector('.alert');
            if (alert) {
                bootstrap.Alert.getInstance(alert).close();
            }
        }, 5000);
    }
}
