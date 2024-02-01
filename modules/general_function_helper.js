const Joi = require('joi');

const regexGetFirstLetter = /\b\w/g;

const upper = (string) => string.toUpperCase();

const lower = (string) => string.toLowerCase();

const caps = (string) =>
  string
    .toLowerCase()
    .replace(regexGetFirstLetter, (caps) => caps.toUpperCase());

const errorMessageSimplifier = (error) => {
  const detailErr = error.message;
  if (detailErr.includes('/^[a-zA-Zs]{3,50}$/')) return nameErrorMessage;
  if (detailErr.includes('must be a valid email')) return emailErrorMessage;
  if (detailErr.includes('/^[0-9]{9,13}$/')) return phoneNumErrorMessage;
  return detailErr;
};

const validateUserFidyah = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(115).required(),
    email: Joi.string().email().required(),
    phone_num: Joi.string().min(5).max(15).required(),
    total_qty: Joi.string().min(1).max(7).required(),
    total_qadha: Joi.string().min(1).max(7).required(),
    total_fidyah: Joi.string().min(1).max(15).required()
  });

  const isNotValid = schema.validate(object).error;

  if (isNotValid) throw new Error(errorMessageSimplifier(isNotValid));
  return true;
};

const queryInFormatter = (query) => `${query.replace(/\,/g, ', ')}`;

const getIdnYear = (time) => {
  const regex = /20\d{2}/;

  const year = String(time).match(regex);

  if (!year) throw 'No year found from the time string';

  return +year[0];
};

const toInt = (input) => {
  if (String(+input) === 'NaN') throw 'Input must be all number';
  return +input;
};

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

module.exports = {
  caps,
  formatNumber,
  getIdnYear,
  lower,
  queryInFormatter,
  toInt,
  upper,
  validateUserFidyah
};
