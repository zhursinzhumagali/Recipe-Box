INSERT INTO users (name, email, password)
VALUES ('Admin', 'admin@test.com', '123456');

INSERT INTO categories (name) VALUES ('Soups'), ('Desserts'), ('Salads');

INSERT INTO recipes (title, description, steps, user_id, category_id) VALUES
('Borscht', 'Classic beetroot soup', 'Boil the broth, add vegetables', 1, 1),
('Tiramisu', 'Italian coffee dessert', 'Mix mascarpone, layer with soaked cookies', 1, 2),
('Caesar Salad', 'Salad with chicken', 'Chop ingredients, mix with dressing', 1, 3);