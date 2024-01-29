const {
  getIdnYear,
  formatNumber,
  toInt
} = require('../general_function_helper');
const { fidyah } = require('../../database/executor');
const currency = process.env.FIDYAH_CURRENCY;

const errorMessage =
  "Input 'year' tidak bisa melebihi tahun di waktu sekarang.";

exports.calculateFidyah = async (req) => {
  /**
   * If the year is same with the current year, quantity is one.
   * If the year is minus one from the current year, quantity is one.
   * If the year is minus two and so on from the current year, quantity is current year minus chosen year.
   */

  const { body, query } = req;

  const rate = await fidyah.getRate();

  let calculateOldOrIllFidyah = +query.oldill;

  toInt(rate);
  let fidyahPaid = 0;
  let multiplier;
  let addition;
  let quantity = 0;
  let yearDiff;

  const idnTime = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta'
  });

  const idnYear = getIdnYear(idnTime);

  if (!calculateOldOrIllFidyah) {
    for (let element of body) {
      const { year, days } = element;

      toInt(year);
      toInt(days);

      yearDiff = idnYear - year;

      if (yearDiff < 0) throw errorMessage;

      multiplier = yearDiff === 0 ? 1 : yearDiff;
      quantity += multiplier * days;
      addition = +(multiplier * days * rate).toFixed(2);
      fidyahPaid += addition;
    }
  } else {
    for (let element of body) {
      const { year, days } = element;

      toInt(year);
      toInt(days);

      yearDiff = idnYear - year;

      if (yearDiff < 0) throw errorMessage;

      quantity += days;
      multiplier = 1;
      addition = +(multiplier * days * rate).toFixed(2);
      fidyahPaid += addition;
    }
  }

  let totalFidyah;
  let bayarFidyah = `${currency} `;
  let qadhaPuasa = 0;

  if (+query.oldill === 1) {
    totalFidyah = String(rate).includes('.')
      ? fidyahPaid.toFixed(2)
      : formatNumber(fidyahPaid);

    bayarFidyah += totalFidyah;
  } else {
    totalFidyah = String(rate).includes('.')
      ? fidyahPaid.toFixed(2)
      : formatNumber(fidyahPaid);

    bayarFidyah += totalFidyah;
    qadhaPuasa = body.reduce((a, b) => a + b.days, 0);
  }

  return [rate, { bayarFidyah, qadhaPuasa, qty: quantity }];
};
