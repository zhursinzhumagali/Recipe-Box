const DEMO_MODE = true;
const DEMO_USER = { name: 'Adilet', email: 'adilet@mail.com' };
const DEMO_RECIPES = [
  { id: 1, title: 'Borscht', time: 90, servings: 6, status: 'published' },
  { id: 2, title: 'Tiramisu', time: 40, servings: 8, status: 'pending' },
  { id: 3, title: 'Greek salad', time: 15, servings: 2, status: 'published' },
];
const API_URL = 'http://localhost:8000/api';
const LOGIN_PAGE = '../login/login.html';
const EDIT_PAGE = '../recipe-form/recipe-form.html';
const MAX_AVATAR_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const DEFAULT_ERROR = 'Something went wrong. Please try again';
const NETWORK_ERROR = 'No connection to the server. Check your internet and try again';
const STATUS_LABELS = { published: 'Published', pending: 'Pending review' };
const STATUS_HINTS = { published: 'Visible to everyone', pending: 'Waiting for moderator approval' };

const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const statTotal = document.getElementById('stat-total');
const statPublished = document.getElementById('stat-published');
const statPending = document.getElementById('stat-pending');
const changePhoto = document.getElementById('change-photo');
const avatar = document.getElementById('avatar');
const avatarInput = document.getElementById('avatar-input');
const message = document.getElementById('message');
const recipesGrid = document.getElementById('recipes');
const emptyState = document.getElementById('empty');
const template = document.getElementById('recipe-template');
const dialog = document.getElementById('confirm-dialog');
const confirmTitle = document.getElementById('confirm-title');
const logoutButton = document.getElementById('logout');

const token = localStorage.getItem('token');
let user = null;
let recipes = [];
let recipeToDelete = null;

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    return null;
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = LOGIN_PAGE;
}

function showMessage(text) {
  message.textContent = text;
  message.hidden = false;
}

function hideMessage() {
  message.hidden = true;
}

async function request(path, options) {
  const settings = options || {};
  settings.headers = settings.headers || {};
  settings.headers.Authorization = 'Bearer ' + token;

  let response;

  try {
    response = await fetch(API_URL + path, settings);
  } catch (error) {
    throw new Error(NETWORK_ERROR);
  }

  if (response.status === 401) {
    logout();
  }

  if (!response.ok) {
    throw new Error(DEFAULT_ERROR);
  }

  return response;
}

function showAvatar(imageUrl) {
  avatar.style.backgroundImage = 'url(' + imageUrl + ')';
  avatar.textContent = '';
}

function showUser() {
  userName.textContent = user.name;
  userEmail.textContent = user.email;
  avatar.textContent = user.name.charAt(0).toUpperCase();

  if (user.avatar) {
    showAvatar(user.avatar);
  }
}

function validateAvatar(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Avatar must be a JPG or PNG image';
  }
  if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
    return 'Avatar must be smaller than ' + MAX_AVATAR_MB + ' MB';
  }
  return '';
}

async function uploadAvatar(file) {
  if (DEMO_MODE) {
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    await request('/users/me/avatar', { method: 'POST', body: formData });
  } catch (error) {
    showMessage(error.message);
  }
}

async function handleAvatarChange() {
  const file = avatarInput.files[0];

  if (!file) {
    return;
  }

  const error = validateAvatar(file);

  if (error) {
    showMessage(error);
    return;
  }

  hideMessage();
  showAvatar(URL.createObjectURL(file));
  await uploadAvatar(file);
}

function createCard(recipe) {
  const card = template.content.cloneNode(true);
  const photo = card.querySelector('.card-photo');
  const placeholder = card.querySelector('.card-placeholder');
  const badge = card.querySelector('.badge');

  card.querySelector('.card-title').textContent = recipe.title;
  card.querySelector('.card-meta').textContent = recipe.time + ' min · ' + recipe.servings + ' servings';
  card.querySelector('.card-edit').href = EDIT_PAGE + '?id=' + recipe.id;
  card.querySelector('.card-edit').setAttribute('aria-label', 'Edit ' + recipe.title);
  card.querySelector('.card-delete').setAttribute('aria-label', 'Delete ' + recipe.title);
  card.querySelector('.card-delete').addEventListener('click', function () {
    askDelete(recipe);
  });

  badge.textContent = STATUS_LABELS[recipe.status] || recipe.status;
  badge.className = 'badge badge-' + recipe.status;
  badge.title = STATUS_HINTS[recipe.status] || '';

  if (recipe.photo) {
    photo.src = recipe.photo;
    photo.alt = recipe.title;
    photo.hidden = false;
    placeholder.hidden = true;
  }

  return card;
}

function renderRecipes() {
  recipesGrid.replaceChildren();
  const published = recipes.filter(function (recipe) {
    return recipe.status === 'published';
  }).length;
  const pending = recipes.filter(function (recipe) {
    return recipe.status === 'pending';
  }).length;

  statTotal.textContent = recipes.length + (recipes.length === 1 ? ' recipe' : ' recipes');
  statPublished.textContent = published + ' published';
  statPending.textContent = pending + ' pending';
  emptyState.hidden = recipes.length > 0;

  recipes.forEach(function (recipe) {
    recipesGrid.appendChild(createCard(recipe));
  });
}

async function loadRecipes() {
  if (DEMO_MODE) {
    recipes = DEMO_RECIPES.slice();
    renderRecipes();
    return;
  }

  try {
    const response = await request('/users/me/recipes');
    recipes = await response.json();
    renderRecipes();
  } catch (error) {
    showMessage(error.message);
    statTotal.textContent = '0 recipes';
    emptyState.hidden = true;
  }
}

function askDelete(recipe) {
  recipeToDelete = recipe;
  confirmTitle.textContent = recipe.title;
  dialog.showModal();
}

async function handleDialogClose() {
  const shouldDelete = dialog.returnValue === 'delete';
  dialog.returnValue = '';

  if (!shouldDelete) {
    return;
  }

  try {
    if (!DEMO_MODE) {
      await request('/recipes/' + recipeToDelete.id, { method: 'DELETE' });
    }
    recipes = recipes.filter(function (recipe) {
      return recipe.id !== recipeToDelete.id;
    });
    hideMessage();
    renderRecipes();
  } catch (error) {
    showMessage(error.message);
  }
}

function init() {
  showUser();
  avatar.addEventListener('click', function () {
    avatarInput.click();
  });
  changePhoto.addEventListener('click', function () {
    avatarInput.click();
  });
  avatarInput.addEventListener('change', handleAvatarChange);
  dialog.addEventListener('close', handleDialogClose);
  logoutButton.addEventListener('click', logout);
  loadRecipes();
}

user = DEMO_MODE ? DEMO_USER : readSavedUser();

if (DEMO_MODE || (token && user)) {
  init();
} else {
  window.location.href = LOGIN_PAGE;
}
