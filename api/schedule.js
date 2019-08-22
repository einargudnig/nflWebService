const xss = require('xss');

const { getGame, getResults } = require('./schedule-helpers');
const { query /* pagedQuery */ } = require('../utils/db');

const {
  isInt,
  /* isNotEmptyString,
  lengthValidationError,
  toPositiveNumberOrDefault, */
} = require('../utils/validation');

/**
 *Fall sem birtir listann af leikjum
 */
async function scheduleList(req, res) {
  const scheduleQ = await query(
    'SELECT eid, h, hnn, v, vnn, t, d FROM schedule',
  );

  return res.json(scheduleQ);
}

/**
 *Fall sem sér til þess að hver notandi hafi sér
 *Töflu fyrir sig
 */

async function createOrReturnResults(userId) {
  const currentSchedule = await getResults(userId);

  if (currentSchedule) {
    return currentSchedule;
  }

  const q = `
  INSERT INTO
    results (user_id)
  VALUES
    ($1)
  RETURNING *
  `;

  const result = await query(q, [userId]);

  const schedule = result.rows[0];

  return schedule;
}

// Fall sem kallar á fallið sem finnur rétt eid,
// Skilar niðurstöðu um réttan leik
async function getOneGame(req, res) {
  const { eid } = req.params;

  const singleGame = await getGame(eid);

  if (!singleGame) {
    return res.status(404).json({ error: 'Leikur ekki til!'});
  }

  return res.json(singleGame);
}

/**
 *Fall sem sér um að bæta við sigurvegar í töfluna.
 * Verður að vera eid með til þess að vita hvaða leik er verið að velja.
 */
/*
async function addResults(req, res) {
  // const { user } = req;
  const { eid } = req.body;
  const { myWinner } = req.body;
  // console.log(req.body);

  // const schedule = await createOrReturnResults(user.id);

  // await getOneGame(schedule.eid);

  /*
  if (game.length > 0) {
    return res.status(400).json({
      errors: game,
    });
  }


  const q = `
    UPDATE
      results
    SET
      myWinner = $2
    WHERE
      eid = $1
    RETURNING
      eid, myWinner
    `;
  // console.log(q);
  const values = [
    xss(eid),
    xss(myWinner),
  ];
  // console.log(values);
  const result = await query(q, values);

  return res.status(201).json(result.rows[0]);
}
*/

module.exports = {
  scheduleList,
  // addResults,
  getGame,
  getOneGame,
};
