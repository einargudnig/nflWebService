CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL UNIQUE,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(256) NOT NULL UNIQUE,
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  image VARCHAR(256) DEFAULT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  category_id INTEGER REFERENCES categories(id) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(256) NOT NULL UNIQUE,
  email VARCHAR(256) NOT NULL UNIQUE,
  password VARCHAR(128) NOT NULL,
  admin BOOLEAN DEFAULT false,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256),
  address VARCHAR(256),
  order_created TIMESTAMP WITH TIME ZONE,
  order_submitted BOOLEAN DEFAULT false, -- order er frátekið orð
  user_id INTEGER REFERENCES users(id) NOT NULL, -- user er frátekið orð
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
  -- Væri hægt að bæta við frekari constraints til að passa upp á að aðeins sé
  -- til að hámarki ein pöntun með (user_id, false) í einu, þ.e.a.s. ein karfa
);

CREATE TABLE orderLines (
  id SERIAL PRIMARY KEY,
  quantity INTEGER CHECK (quantity > 0),
  product_id INTEGER REFERENCES products(id) NOT NULL,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  UNIQUE(product_id, order_id) -- sama vara ekki oft í sömu körfu/pöntun
);

CREATE TABLE schedule (
  eid VARCHAR(256) PRIMARY KEY,
  gsis VARCHAR(256),
  d VARCHAR(256),
  t VARCHAR(256),
  q VARCHAR(256),
  k VARCHAR(256),
  h VARCHAR(256),
  hnn VARCHAR(256),
  hs VARCHAR(256),
  v VARCHAR(256),
  vnn VARCHAR(256),
  vs VARCHAR(256),
  p VARCHAR(256),
  rz VARCHAR(256),
  ga VARCHAR(256),
  gt VARCHAR(256)
);

CREATE TABLE results (
  id SERIAL,
  game_eid VARCHAR(256) REFERENCES schedule(eid),
  my_winner VARCHAR(256),
  user_id INTEGER REFERENCES users(id) -- NOT NULL ATH MUNA!!! user er frátekið orð
);