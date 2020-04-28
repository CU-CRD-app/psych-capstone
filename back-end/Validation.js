// JavaScript source code
//import env from '../../env'

/**

   * isValidEmail helper method

   * @param {string} email

   * @returns {Boolean} True or False

   */

const isValidEmail = (email) => {

  const regEx = /\S+@\S+\.\S+/;

  return regEx.test(email);

};

/**

   * validatePassword helper method

   * @param {string} password

   * @returns {Boolean} True or False

   */

const validatePassword = (password) => {

  var passwordValidator = require('password-validator');
  var validator = new passwordValidator();
  validator
  .is().min(7)                                    // Minimum length 7
  .is().max(16)                                  // Maximum length 10
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
  return validator.validate(password)
};

/**

   * isEmpty helper method

   * @param {string, integer} input

   * @returns {Boolean} True or False

   */

const isEmpty = (input) => {

  if (input === undefined || input === '') {

    return true;

  }

  if (input.replace(/\s/g, '').length) {

    return false;

  } return true;

};

/**

   * empty helper method

   * @param {string, integer} input

   * @returns {Boolean} True or False

   */

const empty = (input) => {

  if (input === undefined || input === '') {

    return true;

  }

};

const generateUserToken =(email, id , first_name, last_name) =>{
 const token =jwt.sign({
	email,
	user_id: id,
	first_name,
	last_name,
 },
 process.env.secret, {expiresIn: '3d'});
 return token;
};

module.exports= {
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  generateUserToken,
};