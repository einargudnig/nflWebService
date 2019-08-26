const xss = require('xss');

const { getGame, getResults } = require('./schedule-helpers');
const { query /* pagedQuery */ } = require('../utils/db');


/**
 * ATH MUNA AÐ SKOÐA HVERNIG CARTið ER UPPBYGGT
 * ÞAÐ ER EKKI TAFLA PER SE SEM HEITIR KAR, HELDUR
 * BÚIN TIL ÚR ORDERS OG ORDERLINE. KANNSKI HÆGT AÐ GERA SVIPAÐ
 * TAKA USERS OG SCHEDULE OG BOMBA EID OG WINNER Í RESULTS.
 */

/**
 *Fall sem birtir lista af leikjum
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
  // const currentSchedule = await getResults(userId);
  // eslint-disable-next-line no-console
  // console.log('HALLOO', currentSchedule);
  // Fae hallo OG gildid sem er i DB -> Raiders.

  /*
  if (currentSchedule) {
    return currentSchedule;
  }
  */

  const q = `
  INSERT INTO results (user_id)
  VALUES ($1)
  RETURNING id, game_eid, my_winner
  `;

  const result = await query(q, [userId]);

  const schedule = result.rows[0];

  return schedule;
}

// Fall sem kallar á fallið sem finnur rétt eid,
// Skilar niðurstöðu um réttan leik
// ATH getGame fallið er í schedule-helpers
async function getOneGame(req, res) {
  const { eid } = req.params;

  const singleGame = await getGame(eid);

  if (!singleGame) {
    return res.status(404).json({ error: 'Leikur ekki til!' });
  }

  return res.json(singleGame);
}

// Fall sem bætir sigurvegara í results
async function addWinnerToResults(eid, myWinner) {
  const q = `
    UPDATE
      results
    SET
      my_winner = $2
    WHERE
      game_eid = $1
    `;
  // console.log(q);

  const values = [
    xss(eid),
    xss(myWinner),
  ];

  const result = await query(q, values);
  // eslint-disable-next-line no-console
  console.log('Hvada value er eg med her', result);
  return result.rowCount === 1;
}

/**
 * Fall sem listar results, nota getResults fall ur helpers...
 */
async function listResults(req, res) {
  const { user } = req;
  // console.log(req);

  const results = await getResults(user.id);
  // console.log(results);

  if (!results) {
    return res.status(404).json({ error: 'Results not found' });
  }

  return res.status(200).json(results);
}


/**
 *Fall sem sér um að bæta við sigurvegara í töfluna.
 * Verður að vera eid með til þess að vita hvaða leik er verið að velja.
 */

async function addResults(req, res) {
  const { user } = req;
  const { eid, myWinner } = req.body;

  const game = await getGame(eid);
  // HERNA erum vid komin med rettan leik midad vid eid
  // eslint-disable-next-line no-console
  console.log('Leikur sem vid viljum setja inn', game);

  if (!game) {
    return res.status(404).json({ error: 'Leikur ekki til!' });
  }

  const resultsForUser = await createOrReturnResults(user.id);
  // Kemst hingad en resultForUser skilar raiders winner
  // eslint-disable-next-line no-console
  console.log('Why null??', resultsForUser);

  await addWinnerToResults(resultsForUser.id, eid, myWinner);

  const updateResults = await getResults(user.id);
  // eslint-disable-next-line no-console
  console.log(updateResults);
  return res.status(201).json(updateResults);
}

module.exports = {
  scheduleList,
  addResults,
  getGame,
  getOneGame,
  listResults,
};
