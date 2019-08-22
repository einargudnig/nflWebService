const { query } = require('../utils/db');

const {
  isInt,
  /* isNotEmptyString,
  lengthValidationError,
  toPositiveNumberOrDefault, */
} = require('../utils/validation');

/**
 * Fall sem sækir leik eftir eid
 */

async function getGame(eid) {
  if (!isInt(eid)) {
    return null;
  }

  const q = `
    SELECT
      eid, h, hnn, v, vnn, t, d
    FROM
      schedule
    WHERE
      eid = $1
  `;

  const games = await query(
    q,
    [eid],
  );
  // console.log('HALLO', games);
  if (games.rows.length !== 1) {
    return null;
  }

  return games.rows[0];
}

async function getResults(userId) {
  const q = `
    SELECT
      id, 
    FROM
      results
    WHERE
      user_id = $1
  `;

  const result = await query(q, [userId]);

  if (result.rows.length !== 1) {
    return null;
  }

  const results = result.rows[0];

  return results;
}

module.exports = {
  getGame,
  getResults,
};
