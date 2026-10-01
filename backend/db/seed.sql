INSERT INTO users (name, email, password)
VALUES ('Admin', 'admin@test.com', '123456');

INSERT INTO categories (name) VALUES ('Супы'), ('Десерты'), ('Салаты');

INSERT INTO recipes (title, description, steps, user_id, category_id) VALUES
('Борщ', 'Классический борщ', 'Сварить бульон, добавить овощи', 1, 1),
('Тирамису', 'Итальянский десерт', 'Смешать маскарпоне, выложить слоями', 1, 2),
('Цезарь', 'Салат с курицей', 'Нарезать, смешать с соусом', 1, 3);