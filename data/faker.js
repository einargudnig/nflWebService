const faker = require('faker');
const { query } = require('../utils/db');
const debug = require('../utils/debug');

async function createFakeCategories(num) {
  const categories = [];
  let tries = 0;

  while (categories.length < num) {
    if (tries >= num * 2) {
      throw new Error(`Unable to create ${num} categories, ${tries} tries`);
    }
    tries += 1;

    const category = faker.commerce.department();

    if (categories.indexOf(category) < 0) {
      categories.push(category);
    }
  }

  debug(`Bjó til ${categories.length} gervi flokka`);

  const inserted = [];

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    const q = 'INSERT INTO categories (title) VALUES ($1) RETURNING *';

    const result = await query(q, [category]); // eslint-disable-line

    if (categories.length > 20 && i % (categories.length / 10) === 0) {
      debug(`Búið að bæta ${i} gerviflokkum í gagnagrunn`);
    }

    inserted.push(result.rows[0]);
  }

  debug('Búið að bæta gerviflokkum við gagnagrunn');

  return inserted;
}

function createFakeProduct(categories, images = []) {
  console.assert(categories.length > 0, 'Fake product must have category');
  console.assert(
    categories.every(i => i.id && typeof i.id === 'number' && i.id > 0),
    'Categories must have positive integer id',
  );

  const title = faker.commerce.productName();
  const price = parseInt(faker.commerce.price(1), 10);
  const description = faker.lorem.paragraphs();

  const image = images.length > 0 ?
    images[Math.floor(Math.random() * images.length)] : '';

  const category = categories[Math.floor(Math.random() * categories.length)].id;

  return {
    title,
    price,
    description,
    image,
    category,
  };
}

async function createFakeProducts(num, categories, images) {
  const products = [];
  let tries = 0;

  while (products.length < num) {
    if (tries >= num * 2) {
      throw new Error(`Unable to create ${num} products, ${tries} tries`);
    }
    tries += 1;

    const product = createFakeProduct(categories, images);

    if (!products.find(i => i.title === product.title)) {
      products.push(product);
    }
  }

  debug(`Bjó til ${products.length} gerivörur`);

  const inserted = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const q = `
      INSERT INTO products
        (title, price, description, image, category_id)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *`;

    const values = [
      product.title,
      product.price,
      product.description,
      product.image,
      product.category,
    ];

    let result;

    try {
      result = await query(q, values); // eslint-disable-line
    } catch (e) {
      console.info('Reyndi að búa til', product);
      throw e;
    }

    if (products.length > 20 && i % (products.length / 10) === 0) {
      debug(`Búið að bæta ${i} gervivörum í gagnagrunn`);
    }

    inserted.push(result.rows[0]);
  }

  debug('Búið að bæta gervivörum við gagnagrunn');

  return inserted;
}

/**
 * "Gervi" API sem skilar statískum gögnum fyrir fyrirlestra. Gætum hæglega
 * tengt hérna við "alvöru" API.
 * Sameinar statísk gögn við gögn geymd í localStorage.
 */
/*
ATH MUNA AÐ BÆTA SKRÁ VIÐ!!!!!!!!!!!!!!!
import data from './schedule.json';
*/

/**
 * Skilar lista af fyrirlestrum, síuuðum eftir flokkum eða ekki. Gögn um það
 * hvort notandi hafi klárað fyrirlestrar er bætt við gögn.
 *
 * @param {array} filters Fylki af flokkum sem fyrirlestrar mega vera í.
 *                        Sjálfgefið [].
 * @returns {array} Fylki af fyrirlestrum.
 */
/*
export function getScheduleList(filters = []) {
  const { games } = data;

  return games
    .filter(i => filters.length === 0 || filters.indexOf(i.week) >= 0)
}
*/


module.exports = {
  createFakeCategories,
  createFakeProducts,
};
