CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	email VARCHAR(50),
	password VARCHAR (100)
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150)
);

CREATE TABLE favorites (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  value INT NOT NULL CHECK (value BETWEEN 1 AND 5),
  UNIQUE (user_id, recipe_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);