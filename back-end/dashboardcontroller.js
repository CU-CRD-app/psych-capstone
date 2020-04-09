// JavaScript source code
import {
  getDashboard,
  getDashinfoById,
  createDashinfo,
  updateDashinfo,
  deleteDashinfo,
}from '../db/dev/getDashboard';

import {
  isEmpty, empty,
} from '../helpers/Validation';

import {

  errorMessage, successMessage, status,

} from '../helpers/status';

const addDashDetails = async (req, res) => {
const {
	currentlevel,notificationtime,overallerrorrate,overallprogressrate,taskfinishednum,taskunfinishednum,
	} = req.body;

if (empty(currentlevel) || empty(notificationtime) || empty(overallerrorrate) || empty(overallprogressrate) || empty(taskfinishednum) || empty(taskunfinishednum)) {
    errorMessage.error = 'All fields are required';
    return res.status(status.bad).send(errorMessage);
}

try {
    const { rows } = await createDashinfo;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to add Dashboard information';
    return res.status(status.error).send(errorMessage);
	}
};

const getallDashinfo = async (req, res) => {
try {
    const { rows } = await getDashboard;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to get all Dashboard information';
    return res.status(status.error).send(errorMessage);
	}
};

const getallDashinfoByID = async (req, res) => {
try {
    const { rows } = await getDashinfoById;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to get all Dashboard information';
    return res.status(status.error).send(errorMessage);
	}
};

const updateDashboardinfo = async (req, res) => {
try {
    const { rows } = await updateDashinfo;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to update Dashboard information';
    return res.status(status.error).send(errorMessage);
	}
};

const deleteDashboardinfo = async (req, res) => {
try {
    const { rows } = await deleteDashinfo;
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Unable to delete Dashboard information';
    return res.status(status.error).send(errorMessage);
	}
};

export {
  addDashDetails,
  getallDashinfo,
  getallDashinfoByID,
  updateDashboardinfo,
  deleteDashboardinfo,
};