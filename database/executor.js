const isEmpty = require('lodash/isEmpty');
const { client } = require('./connection');
const { queryInFormatter } = require('../modules/general_function_helper');

const addUserFidyah = async (data) => {
  const { name, email, phone_num: phoneNum } = data;
  const query =
    'INSERT INTO user_fidyah (name, email, phone_num) VALUES ($1, $2, $3);';
  const params = [name, email, phoneNum];
  return client.query(query, params);
};

const checkUserFidyahByEmail = async (data) => {
  const { email } = data;
  const query =
    'SELECT email FROM user_fidyah where LOWER(email) = LOWER($1) LIMIT 1;';
  const params = [email];
  const executeQuery = await client.query(query, params);
  const { rowCount } = executeQuery;
  return rowCount;
};

const getAllUser = async (data, order = 'DESC') => {
  const { page, limit, orderBy } = data;
  const offset = limit * (page - 1);

  let query =
    'SELECT id, name, email, phone_num FROM user_fidyah ORDER BY created_at ? LIMIT $1 OFFSET $2;';

  order = orderBy;
  if (order === 'DESC' || 'ASC') query = query.replace('?', order);

  const params = [limit, offset];
  const { rows } = await client.query(query, params);
  return rows;
};

const deleteOneOrManyUser = async (data) => {
  const { id } = data;
  let querySelect = 'SELECT id, name FROM user_fidyah WHERE id IN ($1)';
  querySelect = querySelect.replace('$1', queryInFormatter(id));

  let { rows: deletedId } = await client.query(querySelect);

  let queryDelete = 'DELETE FROM user_fidyah WHERE id IN ($1)';
  queryDelete = queryDelete.replace('$1', queryInFormatter(id));

  if (isEmpty(deletedId)) deletedId = [];
  else await client.query(queryDelete);
  return deletedId;
};

module.exports = {
  fidyah: {
    addUserFidyah,
    checkUserFidyahByEmail,
    deleteOneOrManyUser,
    getAllUser
  }
};
