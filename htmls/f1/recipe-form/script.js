const DEMO_MODE = false;
const DEMO_CATEGORIES = [
  { id: 1, name: 'Soups' },
  { id: 2, name: 'Desserts' },
  { id: 3, name: 'Baking' },
  { id: 4, name: 'Salads' },
];
const DEMO_RECIPE = {
  id: 1,
  title: 'Borscht',
  categoryId: 1,
  description: 'Classic homemade borscht',
  time: 90,
  servings: 6,
  ingredients: [{ name: 'Beetroot', amount: '2 pcs' }, { name: 'Beef', amount: '500 g' }],
  steps: ['Boil the broth', 'Add the vegetables and simmer'],
};

const API_URL = 'http://localhost:3000';
const LOGIN_PAGE = '../login/login.html';
const PROFILE_PAGE = '../profile/profile.html';
const MAX_PHOTO_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const DEFAULT_ERROR = 'Something went wrong. Please try again';
const NETWORK_ERROR = 'No connection to the server. Check your internet and try again';

const form = document.getElementById('recipe-form');
const pageTitle = document.getElementById('page-title');
const message = document.getElementById('message');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const timeInput = document.getElementById('time');
const servingsInput = document.getElementById('servings');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');
const ingredientsList = document.getElementById('ingredients');
const stepsList = document.getElementById('steps');
const ingredientTemplate = document.getElementById('ingredient-template');
const stepTemplate = document.getElementById('step-template');
const submitButton = document.getElementById('submit-button');

const token = localStorage.getItem('token');
const recipeId = new URLSearchParams(window.location.search).get('id');
let photoError = '';

function showMessages(texts) {
  message.replaceChildren();

  texts.forEach(function (text) {
    const line = document.createElement('p');
    line.textContent = text;
    message.appendChild(line);
  });

  message.hidden = false;
}

async function request(path, options) {
  const settings = options || {};
  settings.headers = settings.headers || {};
  settings.headers['x-user-id'] = token;

  let response;

  try {
    response = await fetch(API_URL + path, settings);
  } catch (error) {
    throw new Error(NETWORK_ERROR);
  }

  if (response.status === 401) {
    window.location.href = LOGIN_PAGE;
  }

  if (!response.ok) {
    throw new Error(DEFAULT_ERROR);
  }

  return response;
}

function addIngredientRow(name, amount) {
  const row = ingredientTemplate.content.cloneNode(true);
  row.querySelector('.ingredient-name').value = name || '';
  row.querySelector('.ingredient-amount').value = amount || '';
  ingredientsList.appendChild(row);
}

function addStepRow(text) {
  const row = stepTemplate.content.cloneNode(true);
  row.querySelector('.step-text').value = text || '';
  stepsList.appendChild(row);
}

function handleRemoveClick(event) {
  if (event.target.classList.contains('remove-button')) {
    event.target.closest('.dyn-row').remove();
  }
}

function readIngredients() {
  const result = [];

  ingredientsList.querySelectorAll('.dyn-row').forEach(function (row) {
    const name = row.querySelector('.ingredient-name').value.trim();
    const amount = row.querySelector('.ingredient-amount').value.trim();

    if (name) {
      result.push({ name: name, amount: amount });
    }
  });

  return result;
}

function readSteps() {
  const result = [];

  stepsList.querySelectorAll('.step-text').forEach(function (input) {
    const text = input.value.trim();

    if (text) {
      result.push(text);
    }
  });

  return result;
}

function collectRecipe() {
  return {
    title: titleInput.value.trim(),
    categoryId: categorySelect.value,
    description: descriptionInput.value.trim(),
    time: Number(timeInput.value),
    servings: Number(servingsInput.value),
    ingredients: readIngredients(),
    steps: readSteps(),
  };
}

function validateRecipe(recipe) {
  const errors = [];

  if (recipe.title.length < 3) {
    errors.push('Enter a title of at least 3 characters');
  }
  if (!recipe.categoryId) {
    errors.push('Choose a category');
  }
  if (!(recipe.time > 0)) {
    errors.push('Enter the cooking time in minutes');
  }
  if (!(recipe.servings > 0)) {
    errors.push('Enter the number of servings');
  }
  if (recipe.ingredients.length === 0) {
    errors.push('Add at least one ingredient');
  }
  if (recipe.steps.length === 0) {
    errors.push('Add at least one step');
  }
  if (photoError) {
    errors.push(photoError);
  }

  return errors;
}

function validatePhoto(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Photo must be a JPG or PNG image';
  }
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
    return 'Photo must be smaller than ' + MAX_PHOTO_MB + ' MB';
  }
  return '';
}

function handlePhotoChange() {
  const file = photoInput.files[0];
  photoError = file ? validatePhoto(file) : '';

  if (file && !photoError) {
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.hidden = false;
  } else {
    photoPreview.hidden = true;
  }

  if (photoError) {
    showMessages([photoError]);
  }
}

function fillCategories(categories) {
  categories.forEach(function (category) {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

async function loadCategories() {
  if (DEMO_MODE) {
    fillCategories(DEMO_CATEGORIES);
    return;
  }

  const response = await request('/categories');
  fillCategories(await response.json());
}

function fillForm(recipe) {
  pageTitle.textContent = 'Edit recipe';
  submitButton.textContent = 'Save changes';
  titleInput.value = recipe.title;
  categorySelect.value = recipe.categoryId;
  descriptionInput.value = recipe.description || '';
  timeInput.value = recipe.time;
  servingsInput.value = recipe.servings;

  recipe.ingredients.forEach(function (item) {
    addIngredientRow(item.name, item.amount);
  });
  recipe.steps.forEach(function (text) {
    addStepRow(text);
  });

  if (recipe.photo) {
    photoPreview.src = recipe.photo;
    photoPreview.hidden = false;
  }
}

async function loadRecipe() {
  if (DEMO_MODE) {
    fillForm(DEMO_RECIPE);
    return;
  }

  const response = await request('/recipes/' + recipeId);
  fillForm(await response.json());
}

async function sendRecipe(recipe) {
  const data = {
    title: recipe.title,
    categoryId: Number(recipe.categoryId),
    description: recipe.description,
    cookTimeMinutes: recipe.time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    steps: recipe.steps
  };

  const method = recipeId ? 'PUT' : 'POST';
  const path = recipeId ? '/recipes/' + recipeId : '/recipes';

  await request(path, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;

  if (isLoading) {
    submitButton.textContent = 'Saving…';
  } else {
    submitButton.textContent = recipeId ? 'Save changes' : 'Save recipe';
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  message.hidden = true;

  const recipe = collectRecipe();
  const errors = validateRecipe(recipe);

  if (errors.length > 0) {
    showMessages(errors);
    message.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  setLoading(true);

  try {
    await sendRecipe(recipe);
    window.location.href = PROFILE_PAGE;
  } catch (error) {
    showMessages([error.message]);
    setLoading(false);
  }
}

async function init() {
  form.addEventListener('submit', handleSubmit);
  photoInput.addEventListener('change', handlePhotoChange);
  ingredientsList.addEventListener('click', handleRemoveClick);
  stepsList.addEventListener('click', handleRemoveClick);
  document.getElementById('add-ingredient').addEventListener('click', function () {
    addIngredientRow();
  });
  document.getElementById('add-step').addEventListener('click', function () {
    addStepRow();
  });

  try {
    await loadCategories();

    if (recipeId) {
      await loadRecipe();
    } else {
      addIngredientRow();
      addStepRow();
    }
  } catch (error) {
    showMessages([error.message]);
  }
}

if (DEMO_MODE || token) {
  init();
} else {
  window.location.href = LOGIN_PAGE;
}
