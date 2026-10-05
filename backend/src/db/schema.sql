CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  author_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  ingredients JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  cook_time_minutes INT CHECK (cook_time_minutes > 0),
  servings INT CHECK (servings > 0),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
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