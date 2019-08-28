const xss = require('xss');

const { getGame, getResults } = require('./schedule-helpers');
const { query /* pagedQuery */ } = require('../utils/db');

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
 * ATH ER EKKI AD NOTA ATM, KANNSKI EYDA????
 */
async function createOrReturnResults(userId) {
  const currentSchedule = await getResults(userId);

  if (currentSchedule) {
    return currentSchedule;
  }


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
async function addWinnerToResults(eid, myWinner, userId) {
  const q = `
    INSERT INTO results(game_eid, my_winner, user_id)
    Values($1, $2, $3)
    `;

  const values = [
    xss(eid),
    xss(myWinner),
    xss(userId),
  ];

  const result = await query(q, values);

  return result.rowCount > 0;
}

/**
 * Fall sem listar results, nota getResults fall ur helpers...
 */
async function listResults(req, res) {
  const { user } = req;

  const results = await getResults(user.id);
  console.log(results);
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
  // er med rettan leik her, get eg ekki bara notad thessa breytu afram??

  if (!game) {
    return res.status(404).json({ error: 'Leikur ekki til!' });
  }

  /*
  const resultsForUser = await createOrReturnResults(user.id);
  // eslint-disable-next-line no-console
  console.log('Wrsl??', resultsForUser);
  */

  const banani = await addWinnerToResults(eid, myWinner, user.id);

  /*
  const updateResults = await getResults(user.id);
  // eslint-disable-next-line no-console
  console.log('Afhverju null her lika?', updateResults);
  */
  return res.status(201).json(banani);
}

module.exports = {
  scheduleList,
  addResults,
  getGame,
  getOneGame,
  listResults,
};
