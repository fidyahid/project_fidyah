const Joi = require('joi');

const regexGetFirstLetter = /\b\w/g;

const upper = (string) => string.toUpperCase();

const lower = (string) => string.toLowerCase();

const caps = (string) =>
  string
    .toLowerCase()
    .replace(regexGetFirstLetter, (caps) => caps.toUpperCase());

const validateUserFidyah = (object) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z\s]{3,50}$/)
      .required(),
    email: Joi.string().email().required(),
    phone_num: Joi.string()
      .pattern(/^[0-9]{9,13}$/)
      .required()
  });

  const isNotValid = schema.validate(object).error;

  if (isNotValid) throw new Error(errorMessageSimplifier(isNotValid));
  return true;
};

const queryInFormatter = (query) => `${query.replace(/\,/g, ', ')}`;

module.exports = {
  caps,
  lower,
  queryInFormatter,
  upper,
  validateUserFidyah
};
