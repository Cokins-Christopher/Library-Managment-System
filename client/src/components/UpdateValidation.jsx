function updateValidation(values) {
  let errors = {};

  // Validation patterns
  const username_pattern = /^[a-zA-Z0-9]{4,}$/; // Only letters and numbers, at least 4 characters
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*[a-z]).{8,}$/; // At least 8 characters including one lowercase

  // FirstName Validation
  if (!values.FirstName) {
    errors.FirstName = "First Name is required";
  }

  // LastName Validation
  if (!values.LastName) {
    errors.LastName = "Last Name is required";
  }

  // Username Validation
  if (!values.Username) {
    errors.Username = "Username is required";
  } else if (!username_pattern.test(values.Username)) {
    errors.Username =
      "Username must be at least 4 characters and contain only letters and numbers";
  }

  // Email Validation
  if (!values.Email) {
    errors.Email = "Email is required";
  } else if (!email_pattern.test(values.Email)) {
    errors.Email = "Email is invalid";
  }

  // Password Validation (optional if password change is allowed)
  if (!values.UserPassword) {
    errors.UserPassword = "Password is required";
  } else if (!password_pattern.test(values.UserPassword)) {
    errors.UserPassword =
      "Password must contain at least 8 characters, including one lowercase";
  }


  return errors;
}

export default updateValidation;
