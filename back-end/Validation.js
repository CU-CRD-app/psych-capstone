// JavaScript source code
import env from '../../env';

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

  if (password.length <= 7 || password === '') {

    return false;

  } return true;

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
 env.secret, {expiresIn: '3d'});
 return token;
};

export {

  isValidEmail,

  validatePassword,

  isEmpty,

  empty,

  generateUserToken,

};