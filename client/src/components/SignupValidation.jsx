function signupValidation(values) {
  let errors = {};

  // Validation patterns
  const username_pattern = /^[a-zA-Z0-9]{4,}$/; // Only letters and numbers, at least 4 characters
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*[a-z]).{8,}$/;

  // First Name Validation
  if (!values.firstName) {
    errors.firstName = "First Name is required";
  } else {
    errors.firstName = "";
  }

  // Last Name Validation
  if (!values.lastName) {
    errors.lastName = "Last Name is required";
  } else {
    errors.lastName = "";
  }

  // Username Validation
  if (!values.username) {
    errors.username = "Username is required";
  } else if (!username_pattern.test(values.username)) {
    errors.username =
      "Username must be at least 4 characters and contain only letters and numbers";
  } else {
    errors.username = "";
  }

  // Email Validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Email is invalid";
  } else {
    errors.email = "";
  }

  // Password Validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (!password_pattern.test(values.password)) {
    errors.password =
      "Password must contain at least 8 characters, including one lowercase";
  } else {
    errors.password = "";
  }

  return errors;
}

export default signupValidation;
