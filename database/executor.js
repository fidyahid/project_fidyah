const isEmpty = require('lodash/isEmpty');
const { client } = require('./connection');
const { queryInFormatter } = require('../modules/general_function_helper');

const addUserFidyah = async (data) => {
  const {
    name,
    email,
    phone_num: phoneNum,
    total_qty: qty,
    total_qadha: qadha,
    total_fidyah: fidyah
  } = data;
  const query =
    'INSERT INTO user_fidyah (name, email, phone_num, total_qty, total_qadha, total_fidyah) VALUES ($1, $2, $3, $4, $5, $6);';
  const params = [name, email, phoneNum, qty, qadha, fidyah];
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
    'SELECT * FROM user_fidyah ORDER BY created_at ? LIMIT $1 OFFSET $2;';

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

const getSetRate = async (query) => {
  let params;
  const { get, secretKey, set } = query;

  let querySelect = 'SELECT rate FROM rate_fidyah where id = 1;';
  const { rows } = await client.query(querySelect);
  const [getRate] = rows;

  const isUpdate = get === '0' && typeof +set === 'number';
  if (isUpdate) {
    if (secretKey !== process.env.SECRET_KEY_FIDYAH) {
      throw new Error('Key tidak valid.');
    }

    let setRate = set < 0 ? set * -1 : +set;
    let queryUpdate = 'UPDATE rate_fidyah SET rate = $1 WHERE id = 1;';
    params = [setRate];

    await client.query(queryUpdate, params);
    return {
      action: 'set',
      oldValue: getRate.rate,
      currentValue: setRate.toString()
    };
  }

  return {
    action: 'get',
    currentValue: getRate.rate
  };
};

const getRate = async () => {
  let query = 'SELECT rate FROM rate_fidyah where id = 1;';
  const { rows } = await client.query(query);
  const [getRate] = rows;
  return getRate.rate;
};

module.exports = {
  fidyah: {
    addUserFidyah,
    checkUserFidyahByEmail,
    deleteOneOrManyUser,
    getAllUser,
    getRate,
    getSetRate
  }
};
