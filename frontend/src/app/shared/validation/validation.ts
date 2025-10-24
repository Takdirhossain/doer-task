export const SignUpValidationPatterns = {
  username: /^(?=.{3,20}$)[A-Za-z][A-Za-z0-9_]*[A-Za-z0-9]$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  mobile: /^\d{11}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
};

export const SignUpValidationMessages = {
  username: {
    required: 'Username is required.',
    pattern: 'Username must be 3-20 characters (letters, numbers, _).'
  },
  email: {
    required: 'Email is required.',
    pattern: 'Email is invalid.'
  },
  mobile: {
    required: 'Phone is required.',
    pattern: 'Phone must be 11 digits.'
  },
  password: {
    required: 'Password is required.',
    pattern: 'Password must be at least 6 characters with letters and numbers.'
  }
};
