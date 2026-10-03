-- INSERT INTO recipes (title, description, steps, user_id, category_id) VALUES

-- ('Mushroom Cream Soup',
--  'Velvety soup made from fresh champignons and cream.',
--  'Ingredients: 500 g champignons, 1 onion, 2 potatoes, 1 garlic clove, 500 ml broth, 150 ml cream, 2 tbsp butter, salt, pepper. Steps: 1) Fry the chopped onion and garlic in butter for 3 minutes. 2) Add sliced mushrooms and cook for 8 minutes. 3) Add diced potatoes and broth, simmer for 15 minutes. 4) Blend until smooth, stir in the cream and season.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Soups')),

-- ('Red Lentil Soup',
--  'Hearty and healthy soup with red lentils, carrots and cumin.',
--  'Ingredients: 200 g red lentils, 1 carrot, 1 onion, 2 garlic cloves, 1 tsp cumin, 1 L vegetable broth, 2 tbsp olive oil, lemon, salt. Steps: 1) Saute the onion, carrot and garlic in oil for 5 minutes. 2) Add cumin and rinsed lentils. 3) Pour in the broth and cook for 20 minutes. 4) Blend partly, add lemon juice and salt.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Soups')),

-- ('Olivier Salad',
--  'Traditional festive salad with potatoes, eggs and pickles.',
--  'Ingredients: 4 potatoes, 3 carrots, 4 eggs, 250 g boiled chicken or sausage, 4 pickles, 200 g green peas, 150 g mayonnaise, salt, pepper. Steps: 1) Boil the potatoes, carrots and eggs until ready and cool them. 2) Dice everything into small cubes, including the pickles and chicken. 3) Add the peas and mayonnaise. 4) Mix, season and chill for 1 hour.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Salads')),

-- ('Caprese Salad',
--  'Simple Italian salad with tomatoes, mozzarella and basil.',
--  'Ingredients: 4 tomatoes, 250 g mozzarella, fresh basil, 3 tbsp olive oil, 1 tbsp balsamic vinegar, salt, pepper. Steps: 1) Slice the tomatoes and mozzarella into rounds. 2) Arrange them on a plate, alternating with basil leaves. 3) Drizzle with olive oil and vinegar. 4) Season with salt and pepper.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Salads')),

-- ('New York Cheesecake',
--  'Creamy baked cheesecake on a crumbly biscuit base.',
--  'Ingredients: 200 g butter biscuits, 80 g melted butter, 600 g cream cheese, 150 g sugar, 3 eggs, 200 ml sour cream, 1 tsp vanilla. Steps: 1) Crush the biscuits, mix with butter and press into a springform pan. 2) Beat cream cheese with sugar, add eggs one by one, then sour cream and vanilla. 3) Pour onto the base. 4) Bake at 160 C for 55 minutes, cool in the oven and chill overnight.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Desserts')),

-- ('Classic Apple Pie',
--  'Homemade pie with cinnamon apples and a golden crust.',
--  'Ingredients: 300 g flour, 150 g cold butter, 80 g sugar, 1 egg, 5 apples, 2 tbsp sugar for filling, 1 tsp cinnamon. Steps: 1) Knead flour, butter, sugar and egg into a dough and chill for 30 minutes. 2) Slice the apples and mix with sugar and cinnamon. 3) Line a pan with two thirds of the dough, add the filling. 4) Cover with the rest of the dough and bake at 190 C for 40 minutes.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Desserts')),

-- ('Vanilla Panna Cotta',
--  'Delicate Italian cream dessert with berry sauce.',
--  'Ingredients: 500 ml cream, 100 ml milk, 60 g sugar, 8 g gelatin, 1 tsp vanilla, 150 g berries. Steps: 1) Soak the gelatin in cold water for 10 minutes. 2) Heat the cream, milk, sugar and vanilla without boiling. 3) Add the squeezed gelatin and stir until dissolved. 4) Pour into glasses and chill for 5 hours. 5) Serve with berries.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Desserts')),

-- ('Beef Lasagna',
--  'Layered pasta with meat ragu, bechamel and cheese.',
--  'Ingredients: 250 g lasagna sheets, 500 g minced beef, 1 onion, 400 g canned tomatoes, 500 ml milk, 50 g butter, 50 g flour, 150 g mozzarella, salt, pepper. Steps: 1) Fry the onion and beef, add tomatoes and simmer for 20 minutes. 2) Make the bechamel: melt butter, add flour, then pour in hot milk and stir until thick. 3) Layer sheets, ragu and bechamel in a dish. 4) Top with mozzarella and bake at 190 C for 35 minutes.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Main Dishes')),

-- ('Grilled Salmon with Lemon',
--  'Juicy salmon fillet with garlic and lemon, ready in 15 minutes.',
--  'Ingredients: 2 salmon fillets, 1 lemon, 2 garlic cloves, 2 tbsp olive oil, dill, salt, pepper. Steps: 1) Mix the oil, minced garlic, lemon juice, salt and pepper. 2) Marinate the fillets for 15 minutes. 3) Fry on a hot grill pan for 4 minutes on each side. 4) Serve with lemon slices and dill.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Main Dishes')),

-- ('Chicken Pilaf',
--  'Fragrant rice dish with chicken, carrots and spices.',
--  'Ingredients: 500 g chicken thighs, 300 g long grain rice, 2 carrots, 2 onions, 1 garlic head, 1 tsp cumin, 100 ml oil, 600 ml hot water, salt. Steps: 1) Fry the chicken pieces in hot oil until golden. 2) Add sliced onions and grated carrots, fry for 10 minutes. 3) Add cumin, salt and hot water, simmer for 15 minutes. 4) Add washed rice and the garlic head, cook covered on low heat for 20 minutes. 5) Rest for 10 minutes and stir.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Main Dishes')),

-- ('Cottage Cheese Pancakes',
--  'Classic syrniki: crispy outside, soft inside.',
--  'Ingredients: 500 g cottage cheese, 1 egg, 3 tbsp flour, 2 tbsp sugar, a pinch of salt, oil for frying, sour cream or jam. Steps: 1) Mix the cottage cheese, egg, sugar and salt. 2) Add the flour and stir. 3) Shape small patties and coat them in flour. 4) Fry in oil for 3 minutes on each side. 5) Serve with sour cream or jam.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Breakfast')),

-- ('Avocado Toast with Egg',
--  'Quick and filling breakfast with creamy avocado and a fried egg.',
--  'Ingredients: 2 slices of bread, 1 ripe avocado, 2 eggs, lemon juice, chili flakes, salt, pepper. Steps: 1) Toast the bread until crispy. 2) Mash the avocado with lemon juice, salt and pepper. 3) Fry the eggs for 3 minutes. 4) Spread the avocado on the toast, top with an egg and sprinkle with chili flakes.',
--  (SELECT id FROM users LIMIT 1), (SELECT id FROM categories WHERE name = 'Breakfast'));