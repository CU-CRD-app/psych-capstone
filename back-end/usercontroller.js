// JavaScript source code
import{
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}from '../db/dev/dbQuery';

import{
  //hashPassword,
  //comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
} from '../helpers/Validation';

import {

  errorMessage, successMessage, status,

} from '../helpers/status';

/**
   * Create A User
   */

const createUserinfo = async (req, res) => {

  const {

    email, first_name, last_name, password,

  } = req.body;


  if (isEmpty(email) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {

    errorMessage.error = 'Email, password, first name and last name field cannot be empty';

    return res.status(status.bad).send(errorMessage);

  }

  if (!isValidEmail(email)) {

    errorMessage.error = 'Please enter a valid Email';

    return res.status(status.bad).send(errorMessage);

  }

  if (!validatePassword(password)) {

    errorMessage.error = 'Password should have length between 7 and 10 including at least 1 digits, 1 uppercase and 1 lowercase without any space in it.';

    return res.status(status.bad).send(errorMessage);

  }

  const hashedPassword = hashPassword(password);

  try {

    const { rows } = await createUser;

    const dbResponse = rows[0];

    delete dbResponse.password;

    const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.first_name, dbResponse.last_name);

    successMessage.data = dbResponse;

    successMessage.data.token = token;

    return res.status(status.created).send(successMessage);

  } catch (error) {

    if (error.routine === '_bt_check_unique') {

      errorMessage.error = 'User with that EMAIL already exist';

      return res.status(status.conflict).send(errorMessage);

    }

    errorMessage.error = 'Operation was not successful';

    return res.status(status.error).send(errorMessage);

  }

};



//Signin

const siginUser = async (req, res) => {

  const { email, password } = req.body;

  if (isEmpty(email) || isEmpty(password)) {

    errorMessage.error = 'Email or Password detail is missing';

    return res.status(status.bad).send(errorMessage);

  }

  if (!isValidEmail(email) || !validatePassword(password)) {

    errorMessage.error = 'Please enter a valid Email or Password';

    return res.status(status.bad).send(errorMessage);

  }

  const signinUserQuery = 'SELECT * FROM users WHERE email = $1';

  try {

    const { rows } = await dbQuery.query(signinUserQuery, [email]);

    const dbResponse = rows[0];

    if (!dbResponse) {

      errorMessage.error = 'User with this email does not exist';

      return res.status(status.notfound).send(errorMessage);

    }

    if (!comparePassword(dbResponse.password, password)) {

      errorMessage.error = 'The password you provided is incorrect';

      return res.status(status.bad).send(errorMessage);

    }

    const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.first_name, dbResponse.last_name);

    delete dbResponse.password;

    successMessage.data = dbResponse;

    successMessage.data.token = token;

    return res.status(status.success).send(successMessage);

  } catch (error) {

    errorMessage.error = 'Operation was not successful';

    return res.status(status.error).send(errorMessage);

  }

};

const getUserinfo = async (req, res) => {
try {
    const { rows } = await getUsers;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to get User information';
    return res.status(status.error).send(errorMessage);
	}
};

const getUserinfoById = async (req, res) => {
try {
    const { rows } = await getUserById;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to get User information By id';
    return res.status(status.error).send(errorMessage);
	}
};

const deleteUserinfo = async (req, res) => {
try {
    const { rows } = await deleteUser;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to delete User information';
    return res.status(status.error).send(errorMessage);
	}
};

const updateUserinfo = async (req, res) => {
try {
    const { rows } = await updateUser;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to update User information';
    return res.status(status.error).send(errorMessage);
	}
};

export {
  createUserinfo,
  siginUser,
  getUserinfo,
  getUserinfoById,
  deleteUserinfo,
  updateUserinfo,
};	