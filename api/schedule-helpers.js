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

  if (games.rows.length !== 1) {
    return null;
  }

  return games.rows[0];
}

/**
 *
 * Fall sem birtir nidurstodur ur toflu.
 */
async function getResults(userId) {
  // console.log(userId);
  const q = `
    SELECT
      game_eid, my_winner, user_id
    FROM
      results
    WHERE
      user_id = $1
  `;

  const result = await query(
    q,
    [userId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result;
}

module.exports = {
  getGame,
  getResults,
};
