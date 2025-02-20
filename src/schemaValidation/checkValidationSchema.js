const {checkSchema} = require('express-validator');

const checkSchemaValidation = checkSchema({
    fname: {
      isLength: {
        options: { min: 3 },
        errorMessage: 'Name must be at least 3 characters long',
      },
    },
    lname: {
        isLength: {
            options: { min: 3 },
            errorMessage: 'Name must be at least 3 characters long',
          },
    },
    email: {
      isEmail: {
        errorMessage: 'Invalid email address',
      },
    },
});

const checkRegisterSchemaValidation = checkSchema({
  username: {
    isLength: {
      options: { min: 3 },
      errorMessage: 'Name must be at least 3 characters long',
    },
    notEmpty:{
      errorMessage: 'Username is required',
    },
    trim:true,
    escape:true,
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required',
    },
    isEmail: {
      errorMessage: 'Must be a valid email',
    },
    normalizeEmail: true,
  },
  contact: {
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: 'Contact number must be exactly 10 digits',
    },
    isNumeric: {
      errorMessage: 'Contact number must contain only numbers',
    },
    notEmpty: {
      errorMessage: 'Contact number is required',
    },
    isMobilePhone: {
      options: ['en-US'], // Validate for USA phone numbers
      errorMessage: 'Must be a valid USA phone number',
    },
    custom: {
      options: (value) => {
        // Custom validation for a 10-digit phone number
        if (!/^\d{10}$/.test(value)) {
          throw new Error('Contact number must be exactly 10 digits');
        }
        return true;
      },
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long',
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*\d).+$/, // At least one uppercase letter and one number
      errorMessage:
        'Password must contain at least one uppercase letter and one number',
    },
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: 'Confirm Password is required',
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      },
    },
  },
  address: {
    // Validate the entire address object
    isObject: {
      errorMessage: 'Address must be an object',
    },
    custom: {
      options: (value) => {
        if (!value.street || !value.landmark || !value.pincode) {
          throw new Error('Address must contain street, landmark, and pincode');
        }
        return true;
      },
    },
  },
  'address.street': {
    notEmpty: {
      errorMessage: 'Street is required',
    },
    isLength: {
      options: { max: 100 },
      errorMessage: 'Street must be less than 100 characters',
    },
    trim: true,
    escape: true,
  },
  'address.landmark': {
    notEmpty: {
      errorMessage: 'Landmark is required',
    },
    isLength: {
      options: { max: 100 },
      errorMessage: 'Landmark must be less than 100 characters',
    },
    trim: true,
    escape: true,
  },
  'address.pincode': {
    notEmpty: {
      errorMessage: 'Pincode is required',
    },
    isLength: {
      options: { min: 6, max: 6 },
      errorMessage: 'Pincode must be exactly 6 digits',
    },
    isNumeric: {
      errorMessage: 'Pincode must contain only numbers',
    },
  },
});

module.exports = {
  checkRegisterSchemaValidation, 
  checkSchemaValidation
};